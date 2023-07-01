import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IAkiProfile } from "@spt-aki/models/eft/profile/IAkiProfile";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILocations } from "@spt-aki/models/spt/server/ILocations";
import { SaveServer } from "@spt-aki/servers/SaveServer";

import type {StaticRouterModService} from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

class Mod implements IPostDBLoadMod,IPreAkiLoadMod
{

    private logger: ILogger;

    private modConfig = require("../config/config.json");
    private databaseServer: DatabaseServer;
    private saveServer: SaveServer;
    private tables : IDatabaseTables;

    private locations : ILocations;

    public postDBLoad(container: DependencyContainer): void {

        // get database from server
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.saveServer = container.resolve<SaveServer>("SaveServer");
        
        this.tables = this.databaseServer.getTables();
        this.locations = this.tables.locations;

    }

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");

        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        
        // Hook up to existing AKI dynamic route
        staticRouterModService.registerStaticRouter(
            "StaticRoutePeekingAki",
            [
                {
                    url: "/client/match/offline/end",
                    action: (url, info, sessionId, output) => 
                    {
                        const profile : IAkiProfile = this.saveServer.getProfile(sessionId);

                        if(this.modConfig.enabled){
                            this.setBossesSpawnChance(profile);
                        }

                        return output;
                    }
                },{
                    url: "/client/game/start",
                    action: (url, info, sessionId, output) => 
                    {
                        const profile : IAkiProfile = this.saveServer.getProfile(sessionId);

                        if(this.modConfig.enabled){
                            this.setBossesSpawnChance(profile);
                        }

                        return output;
                    }

                }
            ],
            "aki"
        );
        

    }

    private setBossesSpawnChance(profile: IAkiProfile){

        const playerLevel = profile.characters.pmc.Info.Level;


       // const levelPercentage = Math.min(Math.ceil((playerLevel/this.modConfig.levelThreshold) * 100),100);

       const levelPercentage = Math.min(Math.ceil(this.calculateBezierCurve(playerLevel/this.modConfig.levelThreshold)*100),100);

        this.logger.info("playerLevel : " + playerLevel + "; bossPercentage : " + levelPercentage);

        //bigmap - Customs
        for(const boss of this.modConfig.locations.bigmap.bosses){
            for(const bossLocationSpawn of this.locations.bigmap.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //factory4_day - Factory day
        for(const boss of this.modConfig.locations.factory4_day.bosses){
            for(const bossLocationSpawn of this.locations.factory4_day.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //factory4_night - Factory night
        for(const boss of this.modConfig.locations.factory4_night.bosses){
            for(const bossLocationSpawn of this.locations.factory4_night.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //interchange - Interchange
        for(const boss of this.modConfig.locations.interchange.bosses){
            for(const bossLocationSpawn of this.locations.interchange.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //rezervbase - Reserve
        for(const boss of this.modConfig.locations.rezervbase.bosses){
            for(const bossLocationSpawn of this.locations.rezervbase.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //shoreline - Shoreline
        for(const boss of this.modConfig.locations.shoreline.bosses){
            for(const bossLocationSpawn of this.locations.shoreline.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }
        //tarkovstreets - Streets Of Tarkov
        for(const boss of this.modConfig.locations.tarkovstreets.bosses){
            for(const bossLocationSpawn of this.locations.tarkovstreets.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }        
        //woods - Woods
        for(const boss of this.modConfig.locations.woods.bosses){
            for(const bossLocationSpawn of this.locations.woods.base.BossLocationSpawn){
                if(bossLocationSpawn.BossName == boss.name){
                    bossLocationSpawn.BossChance = Math.min(levelPercentage,boss.maxChance);
                }
            }
        }

    }

    private calculateBezierCurve(level:any){
        const progressionParameters = this.modConfig.progressionParameters;
        
        return (((1-level)^3)*progressionParameters.p1) + (3*level*Math.pow(1-level,2)*progressionParameters.p2) +(3*(1-level)*Math.pow(level,2)*progressionParameters.p3) + (Math.pow(level,3)*progressionParameters.p4);
    }

    private easeInOutCubic(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
}

module.exports = { mod: new Mod() }