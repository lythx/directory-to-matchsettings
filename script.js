fs = require('fs/promises')

async function main() {
  const dir = process.argv[2]
  if (dir === undefined) {
    console.log('Specify the directory')
    return
  }
  let mapsXml = await parseDir(dir)
  const str = getStart() + mapsXml + '</playlist>'
  await fs.writeFile('MatchSettings.txt', str)
  console.log('Success')
}


async function parseDir(dirname) {
  const filesOrDirs = await fs.readdir(dirname, { withFileTypes: true })
  let mapsXml = ''
  for (const f of filesOrDirs) {
    if (f.isDirectory()) {
      // console.log(dirname, dirname + '/' + f.name)
      mapsXml += await parseDir(dirname + '\\' + f.name)
      continue
    }
    const file = (await fs.readFile(dirname + '/' + f.name)).toString()
    let rawUid = file.match(/ident uid=".*?"/gm)[0]
    if (rawUid == null) {
      rawUid = file.match(/challenge uid=".*?"/gm)[0]
    }
    const uid = rawUid.match(/".*?"/gm)[0].slice(1, -1)
    mapsXml +=
      `  <challenge>
    <file>${dirname + '\\' + f.name}</file>
    <ident>${uid}</ident>
  </challenge>
`
  }
  return mapsXml
}


function getStart() {
  return `<?xml version="1.0" encoding="utf-8" ?>
<playlist>
  <gameinfos>
    <game_mode>0</game_mode>
    <chat_time>10000</chat_time>
    <finishtimeout>1</finishtimeout>
    <allwarmupduration>0</allwarmupduration>
    <disablerespawn>0</disablerespawn>
    <forceshowallopponents>0</forceshowallopponents>
    <rounds_pointslimit>30</rounds_pointslimit>
    <rounds_usenewrules>0</rounds_usenewrules>
    <rounds_forcedlaps>0</rounds_forcedlaps>
    <rounds_pointslimitnewrules>5</rounds_pointslimitnewrules>
    <team_pointslimit>50</team_pointslimit>
    <team_maxpoints>6</team_maxpoints>
    <team_usenewrules>1</team_usenewrules>
    <team_pointslimitnewrules>5</team_pointslimitnewrules>
    <timeattack_limit>300000</timeattack_limit>
    <timeattack_synchstartperiod>0</timeattack_synchstartperiod>
    <laps_nblaps>5</laps_nblaps>
    <laps_timelimit>0</laps_timelimit>
    <cup_pointslimit>100</cup_pointslimit>
    <cup_roundsperchallenge>0</cup_roundsperchallenge>
    <cup_nbwinners>3</cup_nbwinners>
    <cup_warmupduration>2</cup_warmupduration>
  </gameinfos>

  <hotseat>
    <game_mode>0</game_mode>
    <time_limit>300000</time_limit>
    <rounds_count>5</rounds_count>
  </hotseat>

  <filter>
    <is_lan>1</is_lan>
    <is_internet>1</is_internet>
    <is_solo>0</is_solo>
    <is_hotseat>0</is_hotseat>
    <sort_index>1000</sort_index>
    <random_map_order>0</random_map_order>
    <force_default_gamemode>0</force_default_gamemode>
  </filter>

  <startindex>1</startindex>
`
}

main()