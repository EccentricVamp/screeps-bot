export const enum Color {
  Blue = "#00aaff",
  Green = "#00ffaa",
  Red = "#ff0000",
  White = "#ffffff",
  Yellow = "#ffaa00"
}

export class Path {
  public static Default = { visualizePathStyle: { stroke: Color.White } };
  public static Energy = { visualizePathStyle: { stroke: Color.Yellow } };
  public static Recycle = { visualizePathStyle: { stroke: Color.Red } };
  public static Respawn = { visualizePathStyle: { stroke: Color.Green } };
  public static Idle = { visualizePathStyle: { stroke: Color.Blue } };
}

export const enum Status {
  Build = "🏗️ build",
  Harvest = "⚒️ harvest",
  Recycle = "♻️ recycle",
  Renew = "🔄 renew",
  Repair = "🛠️ repair",
  Transfer = "⇪ transfer",
  Upgrade = "🏗️ upgrade",
  Withdraw = "⇩ withdraw"
}
