export class Color {
  public static WHITE = "#ffffff";
  public static YELLOW = "#ffaa00";
  public static GREEN = "#00ffaa";
}

export class Path {
  public static DEFAULT = { visualizePathStyle: { stroke: Color.WHITE } };
  public static ENERGY = { visualizePathStyle: { stroke: Color.YELLOW } };
  public static RESPAWN = { visualizePathStyle: { stroke: Color.GREEN } };
}
