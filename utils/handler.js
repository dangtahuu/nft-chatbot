import { COLLECTION } from "../data/collection.js";
import { NFT } from "../data/nft.js";

export const handleList = async (ctx, list) => {
  for (const one of list) {
    await ctx.replyWithPhoto(one.collection.image.image.sized, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "View detail",
              callback_data: `view_detail_${one.collection.address}`,
            },
          ],
        ],
      },
      caption: {
        text: `${one.collection.name.toUpperCase()}
            \n ✔ Volume: ${one.tonValue}
            \n ✔ Floor Price: ${one.floorPrice} TON / ${
          one.currencyFloorPrice
        } USD
            \n ✔ Owners: ${one.collection.approximateHoldersCount}
            \n ✔ Items: ${one.collection.approximateItemsCount}`,
        parse_mode: "MarkdownV2",
      },
    });
  }

  ctx.reply('Click "View detail" to see items in each collection');
};

export const handleListItem = async (ctx, index) => {
  const items = NFT[index].edges.slice(0, 10);

  for (const one of items) {
    await ctx.replyWithPhoto(one.node.previewImage.image.sized, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Buy now",
              url: "https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg",
            },
          ],
        ],
      },
      caption: {
        text: `${one.node.name.toUpperCase()}
            \n ✔ Rarity: ${one.node.rarityRank}
            \n ✔ Price: ${
              one.node.sale.fullPrice
                ? one.node.sale.fullPrice / 1000000000
                : "Not for sale"
            }

            `,
        parse_mode: "MarkdownV2",
      },
    });
  }

  await ctx.reply(
    "You can choose to filter the collection items by 'for sale', 'not for sale' or 'price range'. Choose one below!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "For sale",
              callback_data: `/for_sale_${index}`,
            },
            {
              text: "Not for sale",
              callback_data: `/not_for_sale_${index}`,
            },
            {
              text: "Price range",
              callback_data: `/price_range_${index}`,
            },
          ],
        ],
      },
    }
  );
};

export const handleListItemFiltered = async (ctx, items) => {
  if (items.length === 0)
    return ctx.reply("There are no items in the selected price range");
  for (const one of items) {
    await ctx.replyWithPhoto(one.node.previewImage.image.sized, {
      reply_markup: {
        inline_keyboard: [[{ text: "Buy now", url: "google.com" }]],
      },
      caption: {
        text: `${one.node.name.toUpperCase()}
              \n ✔ Rarity: ${one.node.rarityRank}
              \n ✔ Price: ${
                one.node.sale.fullPrice
                  ? one.node.sale.fullPrice / 1000000000
                  : "Not for sale"
              }
              `,
        parse_mode: "MarkdownV2",
      },
    });
  }
};
