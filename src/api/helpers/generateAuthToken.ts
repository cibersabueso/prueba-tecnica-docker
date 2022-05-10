import * as jwt from "jsonwebtoken";

const generateAuthToken = async (user: any) => {
  //crear el token con la firma del id y la palabra secreta
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET!,
    {
      expiresIn: 1000000,
    }
  );

  user.tokens = user.tokens.concat({ token });
  //concatenar al arreglo de tokens del usuario

  await user.save(); //guardar en la db

  return token;
};

export { generateAuthToken };