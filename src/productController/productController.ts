import type { IncomingMessage, ServerResponse } from "node:http";
import { insertProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.types";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  // console.log("Request", req);
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  console.log(urlParts);
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log(id);
  //  Get all Products
  if (url === "/products" && method === "GET") {
    // const products = [
    //   {
    //     id: 1,
    //     name: "Product - 1",
    //   },
    // ];

    try {
      const products = readProduct();
      return sendResponse(
        res,
        200,
        true,
        "Product retrived successfully",
        products,
      );
    } catch (error) {
      return sendResponse(res, 404, false, "Something went wrong", error);
    }

    // res.writeHead(200, { "content-type": "application/json" });
    // res.end(
    //   JSON.stringify({ message: "This is product route", data: { products } }),
    // );
  } else if (method === "GET" && id !== null) {
    try {
      const products = readProduct();
      const product = products.find((p: IProduct) => p.id === id);
      // console.log(product);
      if (!product) {
        return sendResponse(res, 404, false, "Product Not Found");
      }
      return sendResponse(res, 200, true, "Product retrived Successfully");
    } catch (error) {
      return sendResponse(res, 404, false, "Something went wrong", error);
    }
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    // console.log("body",body);
    const product = readProduct(); // [{},{},{new}];
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);
    product.push(newProduct); // [{},{},{}];
    // console.log(product);
    insertProduct(product);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product Created Successfully",
        data: newProduct,
      }),
    );
  } else if (method === "POST" && url === "/products") {
    try {
      const body = await parseBody(req);
      // console.log("body",body);
      const product = readProduct(); // [{},{},{new}];
      const newProduct = {
        id: Date.now(),
        ...body,
      };
      // console.log(newProduct);
      product.push(newProduct); // [{},{},{}];
      // console.log(product);
      insertProduct(product);

      return sendResponse(
        res,
        200,
        true,
        "Product Created Successfully",
        newProduct,
      );
    } catch (error) {
      return sendResponse(res, 404, false, "Something went wrong", error);
    }
  } else if (method === "PUT" && id !== null) {
    try {
      const body = await parseBody(req);
      const products = readProduct();
      const index = products.findIndex((p: IProduct) => p.id === id);
      console.log(index);

      if (index < 0) {
        return sendResponse(res, 404, false, "Product Not Found");
      }

      products[index] = {
        id: products[index].id,
        ...body,
      };

      insertProduct(products);

      return sendResponse(
        res,
        200,
        true,
        "Product Product Updated Successfully",
        null,
      );
    } catch (error) {
      return sendResponse(res, 404, false, "Something went wrong", error);
    }
  } else if (method === "DELETE" && id != null) {
    try {
      const products = readProduct();
      const index = products.findIndex((p: IProduct) => p.id === id);

      if (index < 0) {
        return sendResponse(res, 404, false, "Product Not Found");
      }

      products.splice(index, 1);
      // console.log(products);
      // console.log("hello world");

      insertProduct(products);

      return sendResponse(res, 200, true, "Product Deleted Successfully", null);
    } catch (error) {
      return sendResponse(res, 404, false, "Something went wrong", error);
    }
  }
};
