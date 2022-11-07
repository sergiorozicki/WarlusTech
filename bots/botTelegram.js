const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const { Telegraf } = require('telegraf');
const Role = require('../models/Role');
const Persona = require('../models/Persona');
const Reclamo = require('../models/Reclamo');
const BotTelegram = require('../models/BotTelegram');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN_TELEGRAM);

const mensajesBot = fs.readFileSync(path.join(__dirname,'./mensajesBotTelegram.json'));
const jsonMensajes = JSON.parse(mensajesBot);

bot.start( async (ctx) => {
    const ultimaAccion = await getUltimaAccion(ctx);
    if(!ultimaAccion) await insUltimaAccion(ctx, ctx.message.text, null, null);
    else await updUltimaAccion(ctx, ctx.message.text, null, null);
    mostrarOpciones(ctx, 'Hola bienvenido, soy el Bot de Warlus Technic garantias. Aquí puedes ver el seguimiento de tu reclamo, o ir a la web para iniciarlo!');
});

bot.hears(jsonMensajes.saludos, async (ctx) => {
    const ultimaAccion = await getUltimaAccion(ctx);
    if(!ultimaAccion) await insUltimaAccion(ctx, ctx.message.text, null, null);
    else await updUltimaAccion(ctx, ctx.message.text, null, null);
    mostrarOpciones(ctx, 'Hola bienvenido, soy el Bot de Warlus Technic garantias. Aquí puedes ver el seguimiento de tu reclamo, o ir a la web para iniciarlo!');
});

bot.on('text', async (ctx) => {
    if(!isNaN(ctx.message.text)) {
        const ultimaAccion = await getUltimaAccion(ctx);
        if(ultimaAccion.ultimaAccion != null && ultimaAccion.ultimaAccion == 'btnVerSeguimiento'){
            await updUltimaAccion(ctx, 'ingresoDNI', ctx.message.text, null);
            ctx.reply('¡Excelente! Ahora ingrese su Nº de orden sin puntos ni espacios. Por ejemplo: 1234');
        }else if(ultimaAccion.ultimaAccion != null && ultimaAccion.ultimaAccion == 'ingresoDNI' && ultimaAccion.dni){
            await updUltimaAccion(ctx, 'ingresoNumeroOrden', ultimaAccion.dni, ctx.message.text);
            await consultarEstado(ctx);
            mostrarOpciones(ctx, 'Si desea puede realizar una nueva operación.');
        }else{
            await updUltimaAccion(ctx, ctx.message.text, null, null);
            mostrarOpciones(ctx, 'Perdón, no puedo comprender lo que dices, por favor se más especifíco, selecciona una de las siguientes opciones.');
        }
    }else{
        await updUltimaAccion(ctx, ctx.message.text, null, null);
        mostrarOpciones(ctx, 'Perdón, no puedo comprender lo que dices, por favor se más especifíco, selecciona una de las siguientes opciones.');
    }
});

bot.action('btnVerSeguimiento', async ctx => {
    ctx.answerCbQuery();
    await updUltimaAccion(ctx, 'btnVerSeguimiento', null, null);
    ctx.reply('Ok, ahora ingrese su DNI, sin puntos ni espacios. Por ejemplo: 12345678');
});

bot.action('btnSalir', async ctx => {
    ctx.answerCbQuery();
    await updUltimaAccion(ctx, 'btnSalir', null, null);
    await ctx.reply('👍');
    bot.telegram.sendMessage(ctx.chat.id, "Hasta luego.", {
        reply_markup: {
            remove_keyboard: true
        }
    });
})

const mostrarOpciones = (ctx, mensaje) => {
    bot.telegram.sendMessage(ctx.chat.id, mensaje, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Iniciar reclamo desde la web", url: 'https://warlustech.herokuapp.com/reclamo' }],
                [{ text: "Ver seguimiento del reclamo", callback_data: 'btnVerSeguimiento' }],
                [{ text: "Salir", callback_data: 'btnSalir' }]
            ]
        }
    })
}

const getUltimaAccion = async (ctx) => {
    try {
        const searchUltimaAccion = await BotTelegram.findOne({ userId: ctx.chat.id });
        if(!searchUltimaAccion) return null;
        return searchUltimaAccion;

    } catch (error) { console.log(error); }
}

const insUltimaAccion = async (ctx, ultimaAccion, dni, numeroOrden) => {
    try {
        const newUltimaAccion = await new BotTelegram({ userId: ctx.chat.id, ultimaAccion, dni, numeroOrden }).save();
        if(!newUltimaAccion) return null;
        return newUltimaAccion;

    } catch (error) { console.log(error); }
}

const updUltimaAccion = async (ctx, ultimaAccion, dni, numeroOrden) => {
    try {
        const updUltimaAccion = await BotTelegram.findOneAndUpdate({ userId: ctx.chat.id }, { ultimaAccion, dni, numeroOrden });
        if(!updUltimaAccion) return null;
        return updUltimaAccion;

    } catch (error) { console.log(error); }
}

const consultarEstado = async (ctx) => {
    try {
        const ultimaAccion = await getUltimaAccion(ctx);
        const { numeroOrden, dni } = ultimaAccion;

        const roleSearch = await Role.findOne({ name: 'CLIENTE' });
        if(!roleSearch) return ctx.reply(`¡Ups! No se encontro un cliente con el DNI ${dni}.`);

        const clienteSearch = await Persona.findOne({ dni, idRole: roleSearch._id });
        if(!clienteSearch) return ctx.reply(`¡Ups! No se encontró un cliente con el DNI ${dni}.`);
       
        const seguimientoReclamo = await Reclamo.findOne({ idCliente: clienteSearch._id, numeroOrden }, {seguimiento: 1}).populate('seguimiento.idEstado');
        if(!seguimientoReclamo) return ctx.reply(`¡Ups! No se encontró seguimiento para el reclamo.`);
        const seguimiento = await procesarSeguimiento(seguimientoReclamo);
        return ctx.reply(`Seguimiento del reclamo:\n\n${seguimiento}`);

    } catch (error) { console.log(error); }
}

const procesarSeguimiento = async (seguimientoReclamo) => {
    try {
        let seguimiento = '';
        for (let i = 0; i < seguimientoReclamo.seguimiento.length; i++)
            seguimiento += 'Fecha: ' + convertirFechaHora(seguimientoReclamo.seguimiento[i].fecha) + '\nEstado: ' + seguimientoReclamo.seguimiento[i].idEstado.name + '\n\n';
        return seguimiento;
    } catch (error) { console.log(error); }
}

const convertirFechaHora = (data) => {
    return (data.getDate() + "/" + parseInt(data.getMonth() + 1) + "/" + data.getFullYear());
}

bot.launch();
module.exports = bot;