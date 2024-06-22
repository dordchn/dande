import { getRouterMAC, loadJsonFile, saveJsonFile, delay } from './utils.mjs'
import promptFactory from 'prompt-sync'

const OUTPUT_PATH = './macToLocation.json'
let routersMapping = loadJsonFile(OUTPUT_PATH) || {}
console.log('Initial DB:', routersMapping)
let currentRouter
const prompt = promptFactory()

async function main() {
  while (true) {
    await delay(2000)
    try {
      currentRouter = getRouterMAC()
    } catch (e) {
      console.error(`Couldn't resolve router MAC`)
      continue
    }
    if (currentRouter in routersMapping) {
      console.log(`Connected to ${currentRouter} (${routersMapping[currentRouter]})`)
      continue;
    }
    console.log(`Found a new router! MAC: "${currentRouter}"`)
    const location = prompt('Enter your location: ')
    routersMapping[currentRouter] = location.trim()
    saveJsonFile(OUTPUT_PATH, routersMapping)
  }
}
main()
