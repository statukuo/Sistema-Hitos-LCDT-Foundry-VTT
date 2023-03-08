/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class HitosActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    let img = CONST.DEFAULT_TOKEN;
    switch (this.type) {
      case "character":
        img = "/systems/hitos-lcdt/assets/icons/character.svg";
        break;
      case "npc":
        img = "/systems/hitos-lcdt/assets/icons/npc.svg";
        break;
      case "organization":
        img = "/systems/hitos-lcdt/assets/icons/organization.svg";
        break;
      case "vehicle":
        img = "/systems/hitos-lcdt/assets/icons/vehicle.svg";
        break;
    }
    if (this.img === "icons/svg/mystery-man.svg") this.img = img;

    super.prepareData();
    const actorData = this;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === "npc" || actorData.type === "character") {
      this._prepareCharacterData();
      this._calculateRD();
      this._calculateDefense();
    }
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData() {
    const actorData = this;
    const data = actorData.system;

    data.aguante.value =
      Number(data.atributos.for.value) +
      Number(Math.floor(data.atributos.vol.value / 2));
    data.entereza.value =
      Number(data.atributos.vol.value) +
      Number(Math.floor(data.atributos.int.value / 2));

    data.resistencia.max = Number(data.aguante.value) * 3;

    var resistencia = Number(data.resistencia.value);
    var resistencia_Max = Number(data.aguante.value);

    if (resistencia < resistencia_Max) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Sano");
      data.resistencia.mod = 0;
    } else if (
      resistencia_Max <= resistencia &&
      resistencia < 2 * resistencia_Max
    ) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Herido");
      data.resistencia.mod = -2;
    } else if (
      2 * resistencia_Max <= resistencia &&
      resistencia < 3 * resistencia_Max
    ) {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Incapacitado");
      data.resistencia.mod = -5;
    } else {
      data.resistencia.status = game.i18n.format("Hitos.Salud.Moribundo");
      data.resistencia.mod = -5;
    }

    data.iniciativa =
      data.atributos.ref.value + Math.floor(data.atributos.int.value / 2);

    data.danio.cuerpo = Math.floor(
      (data.habilidades.combate.value + data.atributos.for.value) / 4
    );
    data.danio.distancia = Math.floor(data.habilidades.combate.value / 4);
  }

  _calculateRD() {
    const actorData = this;
    let RD = 0;
    actorData.items.forEach((item) => {
      if (item.type === "armor" && item.system.equipped === true) {
        RD += item.system.rd;
      }
    });
    actorData.system.rd = RD;
  }

  _calculateDefense(){
    const data = this.system;

    data.defensa.normal =
    Number(data.atributos.ref.value) +
    (Number(data.habilidades.ffisica.value) >=
    Number(data.habilidades.combate.value)
      ? Number(data.habilidades.ffisica.value)
      : Number(data.habilidades.combate.value)) +
    5 +
    Number(data.resistencia.mod);
  data.defensa.des = Number(data.defensa.normal) - 2;
  }
}
