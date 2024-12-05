import { Account, AccountFacet } from '@/interfaces/account'
import { GenshinGachaRecord, StarRailGachaRecord, ZenlessZoneZeroGachaRecord } from '@/interfaces/gacha'
import invoke from '@/utilities/invoke'

export async function findGameDataDirectories (facet: AccountFacet): Promise<string[]> {
  return invoke('plugin:gacha|find_game_data_directories', { facet })
}

export async function findGachaUrl (
  facet: AccountFacet,
  uid: Account['uid'],
  gameDataDir: string
): Promise<string> {
  return invoke('plugin:gacha|find_gacha_url', { facet, uid, gameDataDir })
}

export async function pullAllGachaRecords (
  facet: AccountFacet,
  uid: Account['uid'],
  payload: {
    gachaUrl: string
    gachaTypeAndLastEndIdMappings: Record<
      GenshinGachaRecord['gacha_type'] | StarRailGachaRecord['gacha_type'] | ZenlessZoneZeroGachaRecord['gacha_type'],
      GenshinGachaRecord['id'] | StarRailGachaRecord['id'] | ZenlessZoneZeroGachaRecord['id'] | null
    >
    eventChannel: string
    saveToStorage?: boolean
    fullAmount?: boolean
  }
): Promise<number> {
  return invoke('plugin:gacha|pull_all_gacha_records', {
    facet,
    uid,
    ...payload
  })
}

export async function importGachaRecords (
  facet: AccountFacet,
  uid: Account['uid'],
  file: string
): Promise<number> {
  return invoke('plugin:gacha|import_gacha_records', { facet, uid, file })
}

export async function exportGachaRecords (
  facet: AccountFacet,
  uid: Account['uid'],
  directory: string
): Promise<string> {
  return invoke('plugin:gacha|export_gacha_records', { facet, uid, directory })
}

const PluginGacha = Object.freeze({
  findGameDataDirectories,
  findGachaUrl,
  pullAllGachaRecords,
  importGachaRecords,
  exportGachaRecords
})

export default PluginGacha
