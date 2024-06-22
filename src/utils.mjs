import fs from 'node:fs'
import { execSync } from 'child_process';

const runBash = (command) => execSync(command, { encoding: 'utf8' })

export function getRouterMAC() {
  const defaultGatewayIp = runBash('ip route list | grep default').split(' ')[2]
  const mac = runBash(`arp -a | grep ${defaultGatewayIp}`).split(' ')[3]
  return mac
};

export function loadJsonFile(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'))
  } catch (err) {
    return
  }
}
export const saveJsonFile = (path, data) => fs.writeFileSync(path, JSON.stringify(data))

export const delay = ms => new Promise(res => setTimeout(() => res(), ms))