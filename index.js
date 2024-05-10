import { Telegraf } from "telegraf";
import { NFT } from "./data/nft.js";
import { COLLECTION } from "./data/collection.js";
import {
  handleList,
  handleListItem,
  handleListItemFiltered,
} from "./utils/handler.js";
import { configDotenv } from "dotenv";

configDotenv()

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
  ctx.reply(
    "Welcome to your NFTs bot! Use /list to see popular NFT collections. Use /help to see available commands.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Top 10 by volume",
              callback_data: "top_10",
            },
            {
              text: "Top 10 by floor price",
              callback_data: "top_10_price",
            },
          ],
          [
            {
              text: "Top 10 by owners",
              callback_data: "top_10_owner",
            },
            {
              text: "Top 10 by items",
              callback_data: "top_10_items",
            },
          ],
        ],
      },
    }
  );
});

bot.help((ctx) => {
  ctx.reply("Available commands:\n/list - See popular NFT collections");
});

bot.command("list", async (ctx) => {
  const list = COLLECTION.sort(
    (a, b) => Number(b.tonValue.slice(0, -1)) - Number(a.tonValue.slice(0, -1))
  );
  handleList(ctx, list);
});

bot.action("top_10", async (ctx) => {
  await ctx.reply("Here's top 10 popular NFT collections right now by volume");
  const list = COLLECTION.sort(
    (a, b) => Number(b.tonValue.slice(0, -1)) - Number(a.tonValue.slice(0, -1))
  );
  handleList(ctx, list);
  ctx.answerCbQuery();
});

bot.command("list_price", async (ctx) => {
  const list = COLLECTION.sort(
    (a, b) => b.currencyFloorPrice - a.currencyFloorPrice
  );
  handleList(ctx, list);
});

bot.action("top_10_price", async (ctx) => {
  await ctx.reply("Here's top 10 popular NFT collections right now by price");
  const list = COLLECTION.sort(
    (a, b) => b.currencyFloorPrice - a.currencyFloorPrice
  );

  handleList(ctx, list);
  ctx.answerCbQuery();
});

bot.command("list_owners", async (ctx) => {
  const list = COLLECTION.sort(
    (a, b) =>
      b.collection.approximateHoldersCount -
      a.collection.approximateHoldersCount
  );

  handleList(ctx, list);
});

bot.action("top_10_owner", async (ctx) => {
  await ctx.reply("Here's top 10 popular NFT collections right now by owners");
  const list = COLLECTION.sort(
    (a, b) =>
      b.collection.approximateHoldersCount -
      a.collection.approximateHoldersCount
  );

  handleList(ctx, list);
  ctx.answerCbQuery();
});

bot.command("list_items", async (ctx) => {
  const list = COLLECTION.sort(
    (a, b) =>
      b.collection.approximateItemsCount - a.collection.approximateItemsCount
  );

  handleList(ctx, list);
});

bot.action("top_10_items", async (ctx) => {
  await ctx.reply("Here's top 10 popular NFT collections right now by items");
  const list = COLLECTION.sort(
    (a, b) =>
      b.collection.approximateItemsCount - a.collection.approximateItemsCount
  );
  handleList(ctx, list);
  ctx.answerCbQuery();
});

bot.action(/view_detail_+/, async (ctx) => {
  const address = ctx.match.input.substring(12);
  const index = NFT.findIndex((one) => one.address === address);
  await ctx.reply(
    `Viewing items in the collection "${COLLECTION[index].collection.name}"`
  );

  handleListItem(ctx, index);
  ctx.answerCbQuery();
});

bot.action(/not_for_sale_+/, async (ctx) => {
  const index = ctx.match.input.substring(14);
  const items = NFT[index].edges;
  items.filter((one) => !one.node.owner.id);
  await ctx.reply(
    `Viewing items not for sale in the collection "${COLLECTION[index].collection.name}"`
  );

  handleListItemFiltered(ctx, items);
  ctx.answerCbQuery();
});

bot.action(/for_sale_+/, async (ctx) => {
  const index = ctx.match.input.substring(10);
  const items = NFT[index].edges;
  items.filter((one) => !one.node.owner.id);
  await ctx.reply(
    `Viewing items for sale in the collection "${COLLECTION[index].collection.name}"`
  );

  handleListItemFiltered(ctx, items);
  ctx.answerCbQuery();
});

bot.action(/price_range_+/, async (ctx) => {
  const index = ctx.match.input.substring(13);
  const items = NFT[index].edges;
  await ctx.reply("Please enter the start and end value (example: 1-2)");
  bot.on("text", async (ctx) => {
    const value = ctx.message.text;
    const [start, end] = value.split("-");
    const newItems = items.filter(
      (one) =>
        one.node.sale.fullPrice / 1000000000 >= Number(start) &&
        one.node.sale.fullPrice / 1000000000 <= Number(end)
    );
    await ctx.reply(
      `Viewing items in the price range ${start} to ${end} in the collection "${COLLECTION[index].collection.name}"`
    );
    handleListItemFiltered(ctx, newItems);
  });
});

bot.launch();
