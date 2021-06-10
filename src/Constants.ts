export const enum Color {
  Blue = "#00aaff",
  Green = "#00ffaa",
  Purple = "#aa00ff",
  Red = "#ff0000",
  White = "#ffffff",
  Yellow = "#ffaa00"
}

export class Path {
  public static Claim = { visualizePathStyle: { stroke: Color.Purple } };
  public static Default = { visualizePathStyle: { stroke: Color.White } };
  public static Energy = { visualizePathStyle: { stroke: Color.Yellow } };
  public static Recycle = { visualizePathStyle: { stroke: Color.Red } };
  public static Renew = { visualizePathStyle: { stroke: Color.Green } };
  public static Idle = { visualizePathStyle: { stroke: Color.Blue } };
}

export const enum Message {
  Build = "🏗️ build",
  Claim = "🚩 claim",
  Harvest = "⚒️ harvest",
  PickUp = "🧲 pick up",
  Recycle = "♻️ recycle",
  Renew = "↻ renew",
  Repair = "🛠️ repair",
  Transfer = "⇪ transfer",
  Upgrade = "🏗️ upgrade",
  Withdraw = "⇩ withdraw"
}
