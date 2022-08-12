const passport = require('koa-passport');
const Router = require('koa-router')
const {logger}=require('../services/logger')
const router=new Router({
    prefix: '/auth'
});

router.get('/login', async(ctx, next)=>{
    await ctx.render('login.pug');
});

router.get('/signup', async(ctx, next)=>{
    await ctx.render('signup');
    next();
});

router.post('/login',async (ctx, next)=>{
     return passport.authenticate('login', (err, user)=>{  //{failureRedirect:'/auth/loginFailed'});
        if (user===false){
            ctx.body={success: false};
            ctx.throw(401);
        }else{
            ctx.body={success: true};
            return ctx.login(user)
        }
     })(ctx);
     await next(); 
});


router.get('/loginFailed', async(ctx, next)=>{
    ctx.status=401
    ctx.body={error:'Usuario o contraseña erroneos'}
    await ctx.render('loginFailed');
});

router.get('/signupFailed', async (ctx, next)=>{
    ctx.status=501
    ctx.body={error:'Error al generar usuario'}
    await ctx.render('signupFailed');
});


router.post('/signup', async (ctx, next)=>{
    await passport.authenticate('signup', {failureRedirect:'/auth/signupFailed'});
    await ctx.render('login')
});


router.post('/logout', async(ctx, next)=> {
    const user = ctx.request.user.email
    logger.info('user logout...', user)
    ctx.logOut(function(err){
        if(err){
            logger.error(`error en logout - ${err}`);
            return next(err)
        }
    });
    await ctx.render('logout', {user: user})
})


module.exports=router.routes()