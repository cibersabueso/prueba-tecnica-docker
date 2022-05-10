import { model, Schema } from "mongoose";

const exchangeRequestSchema = new Schema(
  {
    tipo_de_cambio: {
      type: String,
      required: true,
      unique: false,
    },
    tasa_de_cambio: {
      type: {
          _id: {
              type: String,
          },
          purchase_price: {
              type: Number,
          },
          sale_price: {
            type: Number,
        }
      },
      required: true,
    },
    monto_enviar: {
      type: Number,
    },
    monto_recibir: {
      type: Number,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
  },
  {
    timestamps: true,
  }
);

export default model("ExchangeRequest", exchangeRequestSchema);
