import loadEnv from "./lib/loadEnv";
import TicketerBot from "./bot/client/TicketerBot";

loadEnv("environment.yml");
new TicketerBot().start().then();
