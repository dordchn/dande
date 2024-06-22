import minimist from 'minimist'
import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";
import { getRouterMAC } from './utils.mjs'

const COLLECTION = 'Locations'

const args = minimist(process.argv.slice(2))
if (args.help || typeof args.email !== 'string' || !args.email.match(/^\S+@\S+\.\S+$/)) {
  console.log(`Usage: ${process.argv[1]} --email <email>\n`)
  process.exit()
}

async function main() {
  let routerMac
  try {
    routerMac = getRouterMAC()
  } catch (err) {
    console.error(`Couldn't resolve router MAC`)
    process.exit()
  }
  console.log(`MAC address: ${routerMac}`)

  const wixClient = createClient({
    modules: { items },
    auth: OAuthStrategy({
      clientId: `7f17753a-7db1-4694-829d-e0162cf3d7db`,
    }),
  });
  await upsertLocation(wixClient, args.email, routerMac)
}

await main()

async function upsertLocation(wixClient, email, macAddr) {
  try {
    await wixClient.items.updateDataItem(email, {
      dataCollectionId: COLLECTION,
      dataItem: { data: { _id: email, mac: macAddr } },
    })
  } catch (err) {
    const errorCode = err.details.applicationError.code
    if (errorCode == 'WDE0073') { // "Item does not exist in collection" - insert
      await wixClient.items.insertDataItem({
        dataCollectionId: COLLECTION,
        dataItem: { _id: email, data: { _id: email, mac: macAddr } },
      })
    } else {
      throw err
    }
  }
}