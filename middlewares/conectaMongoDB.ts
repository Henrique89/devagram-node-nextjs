import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose from "mongoose";
import { error } from "console";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler : NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse <RespostaPadraoMsg>) => {
        // verificar se o bd já está conectado, se estiver seguir para o endpoint ou prox middleware

        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }
        // já que nao esta conectado vamos conectar
        //obter a variavel de ambiente preenchida do end

        const {DB_CONEXAO_STRING} = process.env;
       // se a env estiver vazia aborta o uso do sistema e avisa programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({erro: 'ENV de configuração do banco não informado'});
            
        }

       mongoose.connection.on('connected', () => console.log('Bando de dados conectado'));
       mongoose.connection.on('error', error => console.log(`Erro ao conectar o bando de dados: ${error}`));
       await mongoose.connect(DB_CONEXAO_STRING);

       //agora posso seguir para o endpoint, pois estou conectado ao banco
       return handler (req, res)
          
    }