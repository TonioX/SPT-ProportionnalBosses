"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
class Mod {
    constructor() {
        this.modConfig = require("../config/config.json");
    }
    postDBLoad(container) {
        // get logger
        this.logger = container.resolve("WinstonLogger");
        // get database from server
        this.databaseServer = container.resolve("DatabaseServer");
        // get the config server
        const configServer = container.resolve("ConfigServer");
        // Request bot config
        // Required - ConfigTypes.BOT is the enum of the config we want, others include ConfigTypes.Airdrop
        this.airdropConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.AIRDROP);
        this.ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        this.tables = this.databaseServer.getTables();
        this.items = this.tables.templates.items;
        this.locations = this.tables.locations;
        if (this.modConfig.biggerStash.enabled) {
            this.setBiggerStashes();
        }
        if (this.modConfig.bossChances.enabled) {
            this.setBossesSpawnChance();
        }
        if (this.modConfig.removeBlackLists.enabled) {
            this.setBlackLists();
        }
    }
    setBiggerStashes() {
        const stashesId = ["566abbc34bdc2d92178b4576", "5811ce572459770cba1a34ea", "5811ce662459770f6f490f32", "5811ce772459770e9e5f9532"];
        for (const stashId of stashesId) {
            const stash = this.items[stashId];
            stash._props.Grids[0]._props.cellsV = stash._props.Grids[0]._props.cellsV * this.modConfig.biggerStash.multiplier;
        }
    }
    setBossesSpawnChance() {
        //bigmap - Customs
        for (const boss of this.modConfig.bossChances.locations.bigmap.bosses) {
            for (const bossLocationSpawn of this.locations.bigmap.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //factory4_day - Factory day
        for (const boss of this.modConfig.bossChances.locations.factory4_day.bosses) {
            for (const bossLocationSpawn of this.locations.factory4_day.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //factory4_night - Factory night
        for (const boss of this.modConfig.bossChances.locations.factory4_night.bosses) {
            for (const bossLocationSpawn of this.locations.factory4_night.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //interchange - Interchange
        for (const boss of this.modConfig.bossChances.locations.interchange.bosses) {
            for (const bossLocationSpawn of this.locations.interchange.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //rezervbase - Reserve
        for (const boss of this.modConfig.bossChances.locations.rezervbase.bosses) {
            for (const bossLocationSpawn of this.locations.rezervbase.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //shoreline - Shoreline
        for (const boss of this.modConfig.bossChances.locations.shoreline.bosses) {
            for (const bossLocationSpawn of this.locations.shoreline.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //tarkovstreets - Streets Of Tarkov
        for (const boss of this.modConfig.bossChances.locations.tarkovstreets.bosses) {
            for (const bossLocationSpawn of this.locations.tarkovstreets.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
        //woods - Woods
        for (const boss of this.modConfig.bossChances.locations.woods.bosses) {
            for (const bossLocationSpawn of this.locations.woods.base.BossLocationSpawn) {
                if (bossLocationSpawn.BossName == boss.name) {
                    bossLocationSpawn.BossChance = boss.chance;
                }
            }
        }
    }
    setBlackLists() {
        if (!this.modConfig.removeBlackLists.airdropBlackList) {
            this.airdropConfig.loot.itemBlacklist = [];
        }
        this.ragfairConfig.dynamic.barter.itemTypeBlacklist = [];
        if (!this.modConfig.removeBlackLists.enableBsgList) {
            this.ragfairConfig.dynamic.blacklist.enableBsgList = this.modConfig.removeBlackLists.enableBsgList;
        }
        if (!this.modConfig.removeBlackLists.enableQuestList) {
            this.ragfairConfig.dynamic.blacklist.enableQuestList = this.modConfig.removeBlackLists.enableQuestList;
        }
        if (!this.modConfig.removeBlackLists.traderItems) {
            this.ragfairConfig.dynamic.blacklist.traderItems = !this.modConfig.removeBlackLists.traderItems;
        }
    }
}
module.exports = { mod: new Mod() };
