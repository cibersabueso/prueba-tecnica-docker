import { Request, Response } from "express";

import ExchangeRequest from "../model/ExchangeRequest";
import axios from "../utils/axios";

const getAllRequests = async (req: Request, res: Response) => {
  try {
    const requests = await ExchangeRequest.find({user: req.body.user});
    res.send(requests);
  } catch (error) {
    res.status(500).send(error);
  }
};

const postRequest = async (req: Request, res: Response) => {
  try {
    const { monto_enviar, tipo_de_cambio } = req.body;

    const response = await axios.get("/api/v1.1/config/rates");

    const tasa_de_cambio = {
      _id: response.data.data._id,
      purchase_price: response.data.data.purchase_price,
      sale_price: response.data.data.sale_price
    }

     let monto = 0;

    if(tipo_de_cambio === "compra") monto = monto_enviar * response.data.data.purchase_price;
    else if (tipo_de_cambio === "venta") monto = monto_enviar / response.data.data.sale_price;

  const request = new ExchangeRequest({
    tipo_de_cambio,
    tasa_de_cambio,
    monto_enviar,
    monto_recibir: monto,
    user: req.body.user
  });

  const requestDb = await request.save();

  return res.status(200).send(requestDb);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getRequest = async (req: Request, res: Response) => {
    try {
        const request = await ExchangeRequest.findById(req.params.idRequest);

        if(req.body.user._id.toString() !== request.user.toString()) return res.sendStatus(403);

        if(request){
          return res.send(request);
        }

        throw new Error("Request inexistente")
        
      } catch (error) {
        res.status(500).send(error);
      }
};

const deleteRequest = async (req: Request, res: Response) => {
    try {
        const request = await ExchangeRequest.findById(req.params.idRequest);
        if(req.body.user._id.toString() !== request.user.toString()) return res.sendStatus(403);

        await ExchangeRequest.deleteOne({"_id": req.params.idRequest})
        return res.send();
      } catch (error) {
        res.status(500).send(error);
      }
};

export { getAllRequests, getRequest, deleteRequest, postRequest };
