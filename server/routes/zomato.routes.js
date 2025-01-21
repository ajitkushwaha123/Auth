import express from "express";
import puppeteer from "puppeteer";

const zomatoRouter = express.Router();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

zomatoRouter.post("/data", async (req, res) => {
  const { data, browserEndPoint } = req.body;

  console.log("Data received:", data);
  try {
    const browser = await puppeteer.connect({
      defaultViewport: null,
      headless: false,

      browserWSEndpoint: `ws://localhost:9222/devtools/browser/${browserEndPoint}`,
    });

    const page = await browser.newPage();
    await page.goto(
      "https://www.zomato.com/partners/onlineordering/menu/?resId=21270515",
      { waitUntil: "networkidle2" }
    );

    // await page.setViewport({ width: 1120, height: 698 });

    await delay(2000);

    await page.waitForSelector('[data-tut="GO_TO_MENU_EDITOR"]', {
      visible: true,
    });
    await page.click('[data-tut="GO_TO_MENU_EDITOR"]');
    await delay(2000);

    for (const item of data) {
      const { name, description, base_price, variants } = item;
      let {food_type} = item;
      
      if(food_type === "non_veg"){
        food_type = "non-veg"
      }
      // const variants = [
      //   {
      //     property_name: "Size",
      //     values: ["Small", "Medium", "Large"],
      //     prices: [100, 200, 300],
      //   },
      // ];

      try {
        await page.waitForSelector('[data-tut="ADD_CATALOGUE"]', {
          visible: true,
        });

        await page.click('[data-tut="ADD_CATALOGUE"]');
        await delay(2000);

        await page.waitForSelector("#item-name", { visible: true });
        await page.type("#item-name", name);
        await delay(1000);

        await page.waitForSelector("#item-description", { visible: true });
        await page.type("#item-description", description);
        await delay(1000);

        await page.waitForSelector("#item-price", { visible: true });
        await page.type("#item-price", base_price.toString());
        await delay(1000);

        if (["veg", "non-veg", "egg"].includes(food_type)) {
          await page.waitForSelector(`label[for="${food_type}"]`, {
            visible: true,
          });
          await page.click(`label[for="${food_type}"]`);
          console.log(`${food_type} selected.`);
        } else {
          throw new Error(`Invalid food type: "${food_type}"`);
        }

        await delay(3000);

        await page.evaluate(() => {
          const variantBtn = document.evaluate(
            '//button[.//div[contains(text(), "Variants")]]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (variantBtn) {
            variantBtn.click();
          } else {
            throw new Error("Add variants button not found.");
          }
        })

        await delay(2000);

        await page.evaluate(() => {
          const addVariants = document.evaluate(
            '//button[.//div[contains(text(), "Create a new variant")]]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (addVariants) {
            addVariants.click();
          } else {
            throw new Error("Add Variants button not found.");
          }
        });

        await delay(2000);

        for (let i = 0; i < variants?.length; i++) {
          const { property_name, values, prices } = variants[i];
          const propertyValues = values;

          await page.evaluate(() => {
            const addProperty = document.evaluate(
              '//button[.//div[contains(text(), "Add new property")]]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (addProperty) {
              addProperty.click();
            } else {
              throw new Error("Add Property button not found.");
            }
          });

          await delay(2000);

          const variantNameInputSelector =
            'input[placeholder="Enter variant name E.g. Size, crust, "]';

          console.log("var", variantNameInputSelector);
          await page.waitForSelector(variantNameInputSelector, {
            visible: true,
          });
          await page.type(variantNameInputSelector, property_name);
          console.log("Variant name entered.");

          await delay(1000);

          await page.keyboard.press("Enter");

          await delay(2000);

          console.log(`Add new ${property_name}`);

          await page.evaluate((property_name) => {
            const addPropertyVariants = document.evaluate(
              `//button[.//div[contains(text(), 'Add new ${property_name}')]]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (addPropertyVariants) {
              addPropertyVariants.click();
            } else {
              throw new Error("Add Property variants button not found.");
            }
          }, property_name);

          await delay(2000);
          for (let i = 0; i < propertyValues?.length; i++) {
            await page.waitForSelector(
              'input[placeholder="Enter your base variant, Eg: small"][autocomplete="off"]',
              { visible: true }
            );

            const inputElements = await page.$$(
              'input[placeholder="Enter your base variant, Eg: small"][autocomplete="off"]'
            );

            console.log("inputElements", inputElements);

            if (!inputElements[i]) {
              throw new Error(`Input element for iteration ${i} not found.`);
            }

            await inputElements[i].type(propertyValues[i]);

            await delay(2000);

            if (i < propertyValues.length - 1) {
              await page.evaluate((property_name) => {
                const addPropertyVariants = document.evaluate(
                  `//button[.//div[contains(text(), 'Add new ${property_name}')]]`,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                if (addPropertyVariants) {
                  addPropertyVariants.click();
                } else {
                  throw new Error("Add Property Variants button not found.");
                }
              }, property_name);
            } else {
              await page.evaluate(() => {
                const enterPrice = document.evaluate(
                  '//button[contains(text(), "Enter prices and review")]',
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                if (enterPrice) {
                  enterPrice.click();
                } else {
                  throw new Error("Enter Price button not found.");
                }
              });
            }
          }

          await delay(2000);

          await page.waitForSelector(
            'input[variantpriceid="variantPriceInputField"]',
            {
              visible: true,
            }
          );

          const inputElements = await page.$$(
            'input[variantpriceid="variantPriceInputField"]'
          );

          console.log("inputElements", inputElements);

          for (let i = 0; i < inputElements.length; i++) {
            if (!inputElements[i]) {
              throw new Error(`Input element for iteration ${i} not found.`);
            }

            await delay(1000);
            console.log("prices", prices[i]);
            await inputElements[i].type(prices[i].toString());
          }

          await delay(1000);
        }

        await delay(2000);

        await page.evaluate(() => {
          const enterPrice = document.evaluate(
            '//button[contains(text(), "Save")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (enterPrice) {
            enterPrice.click();
          } else {
            throw new Error("Save variants button not found.");
          }
        });

        await delay(2000);

        await page.evaluate(() => {
          const saveButton = document.evaluate(
            '//button[contains(text(), "Save Changes")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (saveButton) {
            saveButton.click();
          } else {
            throw new Error("Save Changes button not found.");
          }
        });

        console.log(`Item "${name}" added successfully.`);
      } catch (err) {
        console.error(`Error adding item "${name}": ${err.message}`);
      }
    }

    await page.waitForSelector('[data-tut="SUBMIT_CHANGES"]', {
      visible: true,
    });
    await page.click('[data-tut="SUBMIT_CHANGES"]');

    await delay(2000);

    await page.evaluate(() => {
      const confirmButton = document.evaluate(
        '//button[contains(text(), "Yes, I confirm")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (confirmButton) {
        confirmButton.click();
      } else {
        throw new Error('"Yes, I confirm" button not found.');
      }
    });

    res.status(200).send("Data received and processed successfully!");
  } catch (err) {
    console.error("Error during automation:", err);
    res.status(500).send(`Error during automation: ${err.message}`);
  }
});

export default zomatoRouter;
