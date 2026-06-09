import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

export type SecretDocument = HydratedDocument<Secret>;

@Schema({
    timestamps: true
})
export class Secret {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    website: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    logo?: string;
}

export const SecretSchema = SchemaFactory.createForClass(Secret);