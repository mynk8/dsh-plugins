/**
 * Smoke test for the packaged client bundle.
 *
 * Loads `client.js` the way the browser module loader does — through
 * `window.__ModuleLoader__.load` — with a stub theme service in place of the
 * real one, then asserts the plugin's public behaviour. No browser and no DSH
 * host are required:
 *
 *   node test/smoke.mjs
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PACKAGE_NAME = '@mynk8/dsh-theme-oxocarbon'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

let registration
globalThis.window = { __ModuleLoader__: { load: (module) => { registration = module } } }
new Function(readFileSync(join(root, 'client.js'), 'utf8'))()

assert.ok(registration, 'client.js did not register with window.__ModuleLoader__')
assert.equal(registration.id, PACKAGE_NAME, 'bundle id must equal the package name')
assert.equal(typeof registration.factory, 'function')

const moduleExports = registration.factory(() => { throw new Error('bundle must not require() anything') })
assert.equal(typeof moduleExports.apply, 'function', 'module face must export apply')
assert.deepEqual(moduleExports.inject, ['theme'], 'module face must inject the theme service')

/** Apply the plugin with a fresh stub ctx and return what it registered. */
function applyWith(config) {
  const captured = {}
  const appended = []
  globalThis.document = {
    querySelector: () => null,
    createElement: () => ({ dataset: {}, textContent: '' }),
    head: { appendChild: (element) => appended.push(element) },
  }
  moduleExports.apply({ theme: { overrideTokens: (source, tokens) => { captured.source = source; captured.tokens = tokens } } }, config)
  return { ...captured, appended }
}

const oxocarbon = applyWith(undefined)
assert.equal(typeof oxocarbon.source, 'string', 'overrideTokens must be scoped to a source name')
assert.ok(oxocarbon.source.length > 0, 'the override source must not be empty')
assert.ok(Object.keys(oxocarbon.tokens).length > 50, 'expected a full alias token layer')

for (const [token, pair] of Object.entries(oxocarbon.tokens)) {
  assert.equal(typeof pair, 'object', token + ' must be a { light, dark } pair, not a bare string')
  assert.equal(typeof pair.light, 'string', token + '.light must be a string')
  assert.equal(typeof pair.dark, 'string', token + '.dark must be a string')
}

const keysOf = (tokens) => Object.keys(tokens).sort().join(',')
for (const palette of ['oxocarbon', 'slack', 'everforest']) {
  const { tokens, source } = applyWith({ palette })
  assert.equal(source, oxocarbon.source, 'the override source must be stable across palettes')
  assert.equal(keysOf(tokens), keysOf(oxocarbon.tokens), palette + ' must define exactly the same tokens as the default')
  if (palette !== 'oxocarbon') {
    assert.notEqual(tokens['--dsh-theme-accent'].dark, oxocarbon.tokens['--dsh-theme-accent'].dark,
      palette + ' should look different from oxocarbon')
  }
}

const unknown = applyWith({ palette: 'not-a-palette' })
assert.equal(keysOf(unknown.tokens), keysOf(oxocarbon.tokens), 'unknown palette must fall back to the default')
assert.equal(unknown.tokens['--dsh-theme-accent'].dark, oxocarbon.tokens['--dsh-theme-accent'].dark)

const bare = applyWith('oxocarbon')
assert.equal(bare.tokens['--dsh-theme-accent'].dark, oxocarbon.tokens['--dsh-theme-accent'].dark, 'a malformed config must not throw')

const layered = applyWith({ palette: 'oxocarbon' })
assert.equal(layered.appended.length, 1, 'the stylesheet layer must be appended exactly once')
assert.equal(layered.appended[0].dataset.dshThemeLayer, layered.source)
assert.ok(layered.appended[0].textContent.length > 1000, 'the stylesheet layer must carry the component skin')

console.log('smoke: ok — ' + Object.keys(oxocarbon.tokens).length + ' tokens, palettes ' + ['oxocarbon', 'slack', 'everforest'].join('/'))
