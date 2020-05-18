import { connect, Mongoose } from "mongoose";

const _connect = (): Promise<Mongoose> => {
    return connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then();
};

export default async (): Promise<Mongoose> => {
    return await _connect();
};
