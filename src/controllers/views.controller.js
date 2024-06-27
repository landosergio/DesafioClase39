import { productsService } from "../repository/products.service.js";
import { cartsService } from "../repository/carts.service.js";

export default class ViewsController {
  static async getProducts(req, res) {
    let { limit, page, sort, query } = req.query;
    let logueado = req.logueado;
    let dbUser = req.user;

    try {
      let productsPagination = await productsService.getProducts(
        limit,
        page,
        sort,
        query,
        false
      );
      if (productsPagination == "wrongPage") {
        req.logger.warning("Se intentó ingresar a una página inexistente");
        return res.send("No existe la página.");
      }
      res.render("home", { productsPagination, logueado, dbUser });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getCartById(req, res) {
    let cId = req.params.cid;

    try {
      let cart = await cartsService.getCartById(cId);
      if (!cart) {
        req.logger.warning("Se intentó obtener un carrito que no existe");
        res.setHeader("Content-Type", "application/json");
        return res.send("No existe el carrito");
      }
      res.status(200).render("cart", { cart });
    } catch (error) {
      req.logger.error("Error en la persistencia");
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getRealTimeProducts(req, res) {
    res.render("realTimeProducts");
  }

  static async register(req, res) {
    let logueado = req.logueado;
    res.render("register", { logueado });
  }

  static async login(req, res) {
    let logueado = req.logueado;
    let loginError = req.query.loginError || false;

    res.render("login", { logueado, loginError });
  }

  static async profile(req, res) {
    let logueado;
    let dbUser;
    let premium = false;

    if (req.user) {
      dbUser = req.user;
      logueado = true;
      if (dbUser.role == "PREMIUM" || dbUser.role == "ADMIN") {
        premium = true;
      }
    } else {
      logueado = false;
    }

    res.render("profile", { logueado, dbUser, premium });
  }

  static async addProduct(req, res) {
    res.render("addProduct");
  }

  static async restorePassword01(req, res) {
    res.render("restorePassword01");
  }
  static async restorePassword02(req, res) {
    res.render("restorePassword02");
  }
}
