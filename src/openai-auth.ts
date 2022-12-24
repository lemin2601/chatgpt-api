import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import * as url from 'node:url'

import delay from 'delay'
import { TimeoutError } from 'p-timeout'
import {
  Browser,
  HTTPResponse,
  Page,
  Protocol,
  PuppeteerLaunchOptions
} from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import random from 'random'

import * as types from './types'
import { isRelevantRequest, minimizePage } from './utils'

puppeteer.use(StealthPlugin())

let hasRecaptchaPlugin = false
let hasNopechaExtension = false

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * Represents everything that's required to pass into `ChatGPTAPI` in order
 * to authenticate with the unofficial ChatGPT API.
 */
export type OpenAIAuth = {
  userAgent: string
  clearanceToken: string
  sessionToken: string
  cookies?: Record<string, Protocol.Network.Cookie>
}

/**
 * Bypasses OpenAI's use of Cloudflare to get the cookies required to use
 * ChatGPT. Uses Puppeteer with a stealth plugin under the hood.
 *
 * If you pass `email` and `password`, then it will log into the account and
 * include a `sessionToken` in the response.
 *
 * If you don't pass `email` and `password`, then it will just return a valid
 * `clearanceToken`.
 *
 * This can be useful because `clearanceToken` expires after ~2 hours, whereas
 * `sessionToken` generally lasts much longer. We recommend renewing your
 * `clearanceToken` every hour or so and creating a new instance of `ChatGPTAPI`
 * with your updated credentials.
 */
export async function getOpenAIAuth({
  email,
  password,
  browser,
  page,
  timeoutMs = 2 * 60 * 1000,
  isGoogleLogin = false,
  isMicrosoftLogin = false,
  captchaToken = process.env.CAPTCHA_TOKEN,
  nopechaKey = process.env.NOPECHA_KEY,
  executablePath,
  proxyServer = process.env.PROXY_SERVER,
  minimize = false,
  sessionToken,
  clearanceToken
}: {
  email?: string
  password?: string
  browser?: Browser
  page?: Page
  timeoutMs?: number
  isGoogleLogin?: boolean
  isMicrosoftLogin?: boolean
  minimize?: boolean
  captchaToken?: string
  nopechaKey?: string
  executablePath?: string
  proxyServer?: string
  sessionToken?: string
  clearanceToken?: string
}): Promise<OpenAIAuth> {
  const origBrowser = browser
  const origPage = page

  try {
    if (!browser) {
      browser = await getBrowser({
        captchaToken,
        nopechaKey,
        executablePath,
        proxyServer
      })
    }

    const userAgent = await browser.userAgent()
    if (!page) {
      page = (await browser.pages())[0] || (await browser.newPage())
      page.setDefaultTimeout(timeoutMs)

      if (minimize) {
        await minimizePage(page)
      }
    }
    let hadSendSessionAuth = false
    // const _onResponse = async (response: HTTPResponse) => {
    //   const request = response.request()
    //   const url = response.url()
    //   if (!isRelevantRequest(url)) {
    //     return
    //   }
    //   const status = response.status()
    //
    //   console.log('\nresponse custom', {
    //     url
    //   })
    //   if (
    //       url === 'https://chat.openai.com/backend-api/conversation' ||
    //       url === 'https://chat.openai.com/backend-api/models' ||
    //       url==='https://chat.openai.com/api/auth/session'
    //   ) {
    //     if (200 === status || status === 401 || status === 403) {
    //       hadSendSessionAuth = true
    //     }
    //   }
    // }
    // page.on('response', _onResponse)
    console.log(new Date(), 'step 4', 'add listener response')
    await delay(1000)

    console.log(new Date(), 'step 4', 'load openai')
    await page.goto('https://chat.openai.com/chat', {
      waitUntil: 'networkidle2'
    })
    console.log(new Date(), 'step 41')

    if (
      clearanceToken &&
      sessionToken &&
      clearanceToken !== '' &&
      sessionToken !== ''
    ) {
      const cookiesCache = [
        {
          name: '__Secure-next-auth.session-token',
          // 'value': 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..HMOYeDp3ZWnsQ3vF.RGRGGV6Of-A1bpp9SWVss0RZUmne28x72_YuDjS6PVHa42aQlPxkwdKvhr3iv9le--6wGU94mUkfcN7vMQ4VcBCVKQo06swlaHiNh8uNNgmsscpFCAYtTSz15u7CMQeTUMYKSSQ0gho_5bjstorOizBubq51t1ibfx2jjzX99m_cISsIZKxkwvDhjE0mj6eP19kL_gyCbl0JwpHL5xebqi8lwL2nXuupCUixVJmTNnnaXT_htJ1V7sY8FzWOM7dgj-g1IOiS_dahlt4dzvvTzz5jY2f_-JdKlN0e5mWPKwQxyGGJGVGOrN7oM5zJ2mX9eFK9QL5ZBzzY4aNqczjdYa9b4SGdGZpozbymbumf2mNFzPuN21WU4Bhtj0VVtzoKLYa3IZZcvQN1rMXlJNCDwhHRAWifCwu29lxH8cf5OMkAHVtbPQhbnpW1delpUa99PkwCHH_hkFxK0MhGnKv3ZWTKZ1UX3CEZALljHkbz0mV8HmnjbVHlzkTNv5xyXlz0YEYn6pyrZRMapOZwxMdE9CJduBpA3Rjvnmisb2RBaLBKKUI5t1D_4vb5Lv_CVJ1voK0QAGdRHUwed89pOHeS_PG57LNnTex8d5m02uZFzHTueoAtKKEEpXGkj7J5eijgpCh5riqRVjGafYPRhtuX6h8V5Z9taViVww-cFYnP_6syK8SVAq-NJwqrZ_CZN520jYmFrf9B5A2fjg0EJ5BwzP5r_G3ktiW-X9wVcwOREmf3wrE4VyPAaKqceQlLsj0KK6yo49ZhU3ZS7t1prAdk-ud2KJKVYGJSWuB6kTUHXmXKCv7fBq-oWM8_IKXXJlACoFG2ebqaoUewzEpBGbPsOQr4ihgkygTgKJTLcOKRq8RsktSWYm5p8oXO0elF4Pz2wETF5TZWbE29yVPCUkB1-hZHs8kKq5Whpe6AWWVQL04x_vY_dr2bzDh_h4vtBYMoTsiflokSSv8Lvo1w_A0iZ9_agrQ1_o0a6GeNPvNi9wVJPANbEGtAhE-ikoZhxEyX3eNVYnjtjo1AhhuYEfYOExEzOL1gFcV6Lh85UPV21yk7BbpVLwFUxS9iM2FSMuPxsjEacajSRy4Si6qB1OOA3cXSZwAIHAS3GalxX3gHmYRRas1tMtDSRl5wmWuI37DN-7Iossbbfv_VqEbu77geockuFZhX_LCt4jCgchgq_kBD-6OjjgFNkMs7Ns4lsqrLxknHn4km6-DqBGd0yb_Iik_UMLoTlufbAHeM-uCTb62q_tXNmrOggUPrkjdzQKgB61XqOmKEdKrPw_dqKcL4RlsxCd6V1DHh_JYSm-A1UaSofadS6FsZCFjEJufBge3yZlkYXm9xg4i2EwsF86zsuqXe47xvDHD4mb3GVEV7zLcXm6kDzThHLFbvOPO4DpCmKdo-TnQuXRYIepkMp1q_bxe9MroshoRn4NEOkaHVRHHsttcgrH2vb9nvCqSddaaosmYFLsqwoEenSwv0SHyHTbo8MMdVoB_nCLRIqncxKn6TGw8IhCODUucXjoA3SpChnP5mQs5tHHDJEQbkmhrDQDTEUHcQHdsC1kZhdA07wUwG4nE4pttgi0GUbRGGfTIY2Oj9CfAvsKt0Up0l19NEGQzCSSiqsupdXByD2LkVTl_tpqBOLOrozqedT52NOLjinfIsvv1T2JnCBT8ELZyzV7yCAoxrVbXfGZEmpWZ2ZEf3ROvHjdAFQekrC8NZDeJVs4s0i1wmD72LbUXeOj4O0DEtM38cW2mxo3MrOLjXn-TWZ9S0UZrchH2gyn7faK3kaY-UVdGQkqExoQJdMX34SlGhbxtoFG9vGMVccbuah2uVnAAsuU9CIBTRjkuV4HePdsphH79QtL5a26xP6cDG9YDAPJfbLWufRH98SCVXfPtOoGtXGbgwjBsLcf2fkyRHgWjx0vFfRqPsDojOryA3akLggW3BG6-7LpGJIOQurgtMnN8uc4ysOZkksaH1iL02OyL7sUDHPNWbPvzpcmfYlwVxeyt7XYO6wspKpJS7nxW8iev-e3w_CDY2Jz99SjQHZ5iOIhs9NqZvmqZSdDOKHRQ3XXoivdBNAsJ1r05tqiV2HKp5L9tJEDjpQnzAhSpklCkEecSOOtb6AMIFekjMQflXp85chyFWEO7PZh6dP-pAzvEEmLjiWy-bM_b__Jyrh6uYfTUyTb4O7OONd_XrziuTcu0cNW47B7wPwfPdVqnNhBTfetTuVM16pkKfoDJYp-8Hxd5Gr39Oo_dV5iSax0-aaUHbVlUs6m4dyiObnQ9MRp-0_lvh2VaxxdVUw9rCz8Yr0f8G6TOOHpXXVnn64XGCA79RSaPU2UcNMTln-IiOjX4V3RR4u6CFu6Q.91A-MssgjBc2H7b75m3mjQ'
          value: sessionToken + ''
        },
        {
          name: 'cf_clearance',
          // 'value': 'OUeS33aFRlVmYkglhi4BR7wXnvZw7wgiI.b1UsDh1G0-1671767188-0-1-26d6bae3.222baa73.31ca379-160'
          value: clearanceToken + ''
        }
      ]
      await page.setCookie(...cookiesCache)
      console.log(new Date(), 'step 42', 'setCookie')
    }
    console.log(new Date(), 'step 5')
    // NOTE: this is where you may encounter a CAPTCHA
    await checkForChatGPTAtCapacity(page, { timeoutMs })
    console.log(new Date(), 'step 5', 'checkForChatGPTAtCapacity')

    if (hasRecaptchaPlugin) {
      const captchas = await page.findRecaptchas()
      console.log(new Date(), 'step 51', 'findRecaptchas')

      if (captchas?.filtered?.length) {
        console.log('solving captchas using 2captcha...')
        const res = await page.solveRecaptchas()
        console.log('captcha result', res)
      }
    }

    console.log(new Date(), 'step 52', 'waitForNavigation')
    await page.waitForNavigation({
      waitUntil: 'networkidle2',
      timeout: timeoutMs
    })
    console.log(new Date(), 'step 51')
    const url = await page.url()
    console.log(new Date(), 'step 6', 'load openai done', url)

    let time = Date.now()
    let timeTryReloadPage = time
    let isPassesCloudFlare = false

    //vượt cloudflare trước khi xác nhận api xác thực
    while (!isPassesCloudFlare) {
      console.log(new Date(), 'step 6', 'pass cloudflare')
      const urlAfter = page.url()
      let isCloudFlare = urlAfter.startsWith(
        'https://chat.openai.com/chat?__cf_chl_tk'
      )
      console.log(
        new Date(),
        'step 61',
        'pass cloudflare wait done',
        urlAfter,
        isCloudFlare
      )
      if (!isCloudFlare) {
        isPassesCloudFlare = true
      } else {
        let now = Date.now()
        if (now - timeTryReloadPage > 10 * 1000) {
          timeTryReloadPage = now
          console.log(
            new Date(),
            'step 621',
            'tien hanh thu f5 page',
            page.url()
          )
          await page.reload()
        }
        console.log(
          new Date(),
          'step 62',
          'wait a minute passed clodflare',
          page.url()
        )
        await delay(4000)
      }
    }
    console.log(new Date(), 'step 8', 'passed cloudflare wait done', page.url())
    // await waitFor( () => {
    //   let now = Date.now();
    //   let offset = now - time;
    //   if (offset > 2 * 60 * 1000) {
    //     // throw 'A timeout occurred 524'
    //     return true
    //   }
    //   const url = page.url();
    //   console.log(new Date(), 'waitFor', hadSendSessionAuth, url);
    //   return hadSendSessionAuth
    // })
    console.log(new Date(), 'step 8', '')
    await delay(1000)
    await checkForChatGPTAtCapacity(page, { timeoutMs })
    console.log(new Date(), 'step 9', '')
    // page.off('response', _onResponse)
    await delay(1000)

    const urlAfter = await page.url()
    console.log(new Date(), 'step 10', '', urlAfter)

    if (urlAfter.startsWith('https://chat.openai.com/auth/login')) {
      // await page.goto('https://chat.openai.com/auth/login', {
      //   waitUntil: 'networkidle2'
      // })
      console.log('progress login with email & password')
      // NOTE: this is where you may encounter a CAPTCHA
      await checkForChatGPTAtCapacity(page, { timeoutMs })

      if (hasRecaptchaPlugin) {
        const captchas = await page.findRecaptchas()

        if (captchas?.filtered?.length) {
          console.log('solving captchas using 2captcha...')
          const res = await page.solveRecaptchas()
          console.log('captcha result', res)
        }
      }

      // once we get to this point, the Cloudflare cookies should be available

      // login as well (optional)
      if (email && password) {
        await waitForConditionOrAtCapacity(page, () =>
          page.waitForSelector('#__next .btn-primary', { timeout: timeoutMs })
        )
        await delay(500)

        // click login button and wait for navigation to finish
        await Promise.all([
          page.waitForNavigation({
            waitUntil: 'networkidle2',
            timeout: timeoutMs
          }),

          page.click('#__next .btn-primary')
        ])

        await checkForChatGPTAtCapacity(page, { timeoutMs })

        let submitP: () => Promise<void>

        if (isGoogleLogin) {
          await page.click('button[data-provider="google"]')
          await page.waitForSelector('input[type="email"]')
          await page.type('input[type="email"]', email, { delay: 10 })
          await Promise.all([
            page.waitForNavigation(),
            await page.keyboard.press('Enter')
          ])
          await page.waitForSelector('input[type="password"]', {
            visible: true
          })
          await page.type('input[type="password"]', password, { delay: 10 })
          submitP = () => page.keyboard.press('Enter')
        } else if (isMicrosoftLogin) {
          await page.click('button[data-provider="windowslive"]')
          await page.waitForSelector('input[type="email"]')
          await page.type('input[type="email"]', email, { delay: 10 })
          await Promise.all([
            page.waitForNavigation(),
            await page.keyboard.press('Enter')
          ])
          await delay(1500)
          await page.waitForSelector('input[type="password"]', {
            visible: true
          })
          await page.type('input[type="password"]', password, { delay: 10 })
          submitP = () => page.keyboard.press('Enter')
          await Promise.all([
            page.waitForNavigation(),
            await page.keyboard.press('Enter')
          ])
          await delay(1000)
        } else {
          await page.waitForSelector('#username')
          await page.type('#username', email)
          await delay(100)

          // NOTE: this is where you may encounter a CAPTCHA
          if (hasNopechaExtension) {
            await waitForRecaptcha(page, { timeoutMs })
          } else if (hasRecaptchaPlugin) {
            console.log('solving captchas using 2captcha...')
            const res = await page.solveRecaptchas()
            if (res.captchas?.length) {
              console.log('captchas result', res)
            } else {
              console.log('no captchas found')
            }
          }

          await delay(1200)
          const frame = page.mainFrame()
          const submit = await page.waitForSelector('button[type="submit"]', {
            timeout: timeoutMs
          })
          frame.focus('button[type="submit"]')
          await submit.focus()
          await submit.click()
          await page.waitForSelector('#password', { timeout: timeoutMs })
          await page.type('#password', password, { delay: 10 })
          submitP = () => page.click('button[type="submit"]')
        }

        await Promise.all([
          waitForConditionOrAtCapacity(page, () =>
            page.waitForNavigation({
              waitUntil: 'networkidle2',
              timeout: timeoutMs
            })
          ),
          submitP()
        ])
      } else {
        await delay(2000)
        await checkForChatGPTAtCapacity(page, { timeoutMs })
      }
    } else {
      console.log(new Date(), 'step 11', 'reloading -> refesh token')
      await page.goto('https://chat.openai.com/chat', {
        waitUntil: 'networkidle2'
      })
      console.log(new Date(), 'step 11', 'reloaded -> refesh token')
    }

    const pageCookies = await page.cookies()
    const cookies = pageCookies.reduce(
      (map, cookie) => ({ ...map, [cookie.name]: cookie }),
      {}
    )

    const authInfo: OpenAIAuth = {
      userAgent,
      clearanceToken: cookies['cf_clearance']?.value,
      sessionToken: cookies['__Secure-next-auth.session-token']?.value,
      cookies
    }

    return authInfo
  } catch (err) {
    throw err
  } finally {
    if (origBrowser) {
      if (page && page !== origPage) {
        await page.close()
      }
    } else if (browser) {
      await browser.close()
    }

    page = null
    browser = null
  }
}

/**
 * Launches a non-puppeteer instance of Chrome. Note that in my testing, I wasn't
 * able to use the built-in `puppeteer` version of Chromium because Cloudflare
 * recognizes it and blocks access.
 */
export async function getBrowser(
  opts: PuppeteerLaunchOptions & {
    captchaToken?: string
    nopechaKey?: string
    proxyServer?: string
    minimize?: boolean
  } = {}
) {
  const {
    captchaToken = process.env.CAPTCHA_TOKEN,
    nopechaKey = process.env.NOPECHA_KEY,
    executablePath = defaultChromeExecutablePath(),
    proxyServer = process.env.PROXY_SERVER,
    minimize = false,
    ...launchOptions
  } = opts

  if (captchaToken && !hasRecaptchaPlugin) {
    hasRecaptchaPlugin = true
    // console.log('use captcha', captchaToken)

    puppeteer.use(
      RecaptchaPlugin({
        provider: {
          id: '2captcha',
          token: captchaToken
        },
        visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
      })
    )
  }

  // https://peter.sh/experiments/chromium-command-line-switches/
  const puppeteerArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--ignore-certificate-errors',
    '--no-first-run',
    '--no-service-autorun',
    '--password-store=basic',
    '--system-developer-mode',
    // the following flags all try to reduce memory
    // '--single-process',
    '--mute-audio',
    '--disable-default-apps',
    '--no-zygote',
    '--disable-accelerated-2d-canvas'
    // '--disable-web-security',
    // '--disable-gpu'
    // '--js-flags="--max-old-space-size=1024"'
  ]

  if (nopechaKey) {
    const nopechaPath = path.join(
      __dirname,
      '..',
      'third-party',
      'nopecha-chrome-extension'
    )
    puppeteerArgs.push(`--disable-extensions-except=${nopechaPath}`)
    puppeteerArgs.push(`--load-extension=${nopechaPath}`)
    hasNopechaExtension = true
  }

  if (proxyServer) {
    const ipPort = proxyServer.includes('@')
      ? proxyServer.split('@')[1]
      : proxyServer
    puppeteerArgs.push(`--proxy-server=${ipPort}`)
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: puppeteerArgs,
    ignoreDefaultArgs: [
      '--disable-extensions',
      '--enable-automation',
      '--disable-component-extensions-with-background-pages'
    ],
    ignoreHTTPSErrors: true,
    executablePath,
    ...launchOptions
  })

  if (process.env.PROXY_VALIDATE_IP) {
    const page = (await browser.pages())[0] || (await browser.newPage())
    if (minimize) {
      await minimizePage(page)
    }

    // Send a fetch request to https://ifconfig.co using page.evaluate() and
    // verify that the IP matches
    let ip: string
    try {
      const res = await page.evaluate(() => {
        return fetch('https://ifconfig.co', {
          headers: {
            Accept: 'application/json'
          }
        }).then((res) => res.json())
      })

      ip = res?.ip
    } catch (err) {
      throw new Error(`Proxy IP validation failed: ${err.toString()}`)
    }

    if (!ip || ip !== process.env.PROXY_VALIDATE_IP) {
      throw new Error(
        `Proxy IP mismatch: ${ip} !== ${process.env.PROXY_VALIDATE_IP}`
      )
    }
  }

  await initializeNopechaExtension(browser, {
    minimize,
    nopechaKey
  })

  return browser
}

export async function initializeNopechaExtension(
  browser: Browser,
  opts: {
    minimize?: boolean
    nopechaKey?: string
  }
) {
  const { minimize = false, nopechaKey } = opts

  // TODO: this is a really hackity hack way of setting the API key...
  if (hasNopechaExtension) {
    const page = (await browser.pages())[0] || (await browser.newPage())
    if (minimize) {
      await minimizePage(page)
    }

    await page.goto(`https://nopecha.com/setup#${nopechaKey}`)
    await delay(1000)
    try {
      const page3 = await browser.newPage()
      if (minimize) {
        await minimizePage(page3)
      }

      await page.close()
      // find the nopecha extension ID
      const targets = browser.targets()
      const extensionIds = (
        await Promise.all(
          targets.map(async (target) => {
            // console.log(target.type(), target.url())

            if (target.type() !== 'service_worker') {
              return
            }

            // const titleL = title?.toLowerCase()
            // if (titleL?.includes('nopecha'))
            const url = new URL(target.url())
            return url.hostname
          })
        )
      ).filter(Boolean)
      const extensionId = extensionIds[0]

      if (extensionId) {
        const extensionUrl = `chrome-extension://${extensionId}/popup.html`
        await page3.goto(extensionUrl, { waitUntil: 'networkidle2' })
        const editKey = await page3.waitForSelector('#edit_key .clickable')
        await editKey.click()

        for (let i = 0; i <= 30; i++) {
          await page3.keyboard.press('Backspace')
        }

        await page3.keyboard.type(nopechaKey)
        await delay(1000)
        await page3.keyboard.press('Enter')
        await delay(1000)
        console.log('initialized nopecha extension with key', nopechaKey)
      } else {
        console.error(
          "error initializing nopecha extension; couldn't determine extension ID"
        )
      }
    } catch (err) {
      console.error('error initializing nopecha extension', err)
    }
  }
}

/**
 * Gets the default path to chrome's executable for the current platform.
 */
export const defaultChromeExecutablePath = (): string => {
  // return executablePath()

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH
  }

  switch (os.platform()) {
    case 'win32':
      return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

    case 'darwin':
      return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

    default: {
      /**
       * Since two (2) separate chrome releases exist on linux, we first do a
       * check to ensure we're executing the right one.
       */
      const chromeExists = fs.existsSync('/usr/bin/google-chrome')

      return chromeExists
        ? '/usr/bin/google-chrome'
        : '/usr/bin/google-chrome-stable'
    }
  }
}

async function checkForChatGPTAtCapacity(
  page: Page,
  opts: {
    timeoutMs?: number
    pollingIntervalMs?: number
    retries?: number
  } = {}
) {
  const {
    timeoutMs = 2 * 60 * 1000, // 2 minutes
    pollingIntervalMs = 3000,
    retries = 10
  } = opts

  // console.log('checkForChatGPTAtCapacity', page.url())
  let isAtCapacity = false
  let numTries = 0

  do {
    try {
      await solveSimpleCaptchas(page)

      const res = await page.$x("//div[contains(., 'ChatGPT is at capacity')]")
      isAtCapacity = !!res?.length

      if (isAtCapacity) {
        if (++numTries >= retries) {
          break
        }

        // try refreshing the page if chatgpt is at capacity
        await page.reload({
          waitUntil: 'networkidle2',
          timeout: timeoutMs
        })

        await delay(pollingIntervalMs)
      }
    } catch (err) {
      // ignore errors likely due to navigation
      ++numTries
      break
    }
  } while (isAtCapacity)

  if (isAtCapacity) {
    const error = new types.ChatGPTError('ChatGPT is at capacity')
    error.statusCode = 503
    throw error
  }
}

async function waitForConditionOrAtCapacity(
  page: Page,
  condition: () => Promise<any>,
  opts: {
    pollingIntervalMs?: number
  } = {}
) {
  const { pollingIntervalMs = 500 } = opts

  return new Promise<void>((resolve, reject) => {
    let resolved = false

    async function waitForCapacityText() {
      if (resolved) {
        return
      }

      try {
        await checkForChatGPTAtCapacity(page)

        if (!resolved) {
          setTimeout(waitForCapacityText, pollingIntervalMs)
        }
      } catch (err) {
        if (!resolved) {
          resolved = true
          return reject(err)
        }
      }
    }

    condition()
      .then(() => {
        if (!resolved) {
          resolved = true
          resolve()
        }
      })
      .catch((err) => {
        if (!resolved) {
          resolved = true
          reject(err)
        }
      })

    setTimeout(waitForCapacityText, pollingIntervalMs)
  })
}

async function solveSimpleCaptchas(page: Page) {
  try {
    const verifyYouAreHuman = await page.$('text=Verify you are human')
    if (verifyYouAreHuman) {
      await delay(2000)
      await verifyYouAreHuman.click({
        delay: random.int(5, 25)
      })
      await delay(1000)
    }

    const cloudflareButton = await page.$('.hcaptcha-box')
    if (cloudflareButton) {
      await delay(2000)
      await cloudflareButton.click({
        delay: random.int(5, 25)
      })
      await delay(1000)
    }
  } catch (err) {
    // ignore errors
  }
}

async function waitForRecaptcha(
  page: Page,
  opts: {
    pollingIntervalMs?: number
    timeoutMs?: number
  } = {}
) {
  await solveSimpleCaptchas(page)

  if (!hasNopechaExtension) {
    return
  }

  const { pollingIntervalMs = 100, timeoutMs } = opts
  const captcha = await page.$('textarea#g-recaptcha-response')
  const startTime = Date.now()

  if (captcha) {
    console.log('waiting to solve recaptcha...')

    do {
      const value = (await captcha.evaluate((el) => el.value))?.trim()
      if (value?.length) {
        // recaptcha has been solved!
        break
      }

      if (timeoutMs) {
        const now = Date.now()
        if (now - startTime >= timeoutMs) {
          throw new TimeoutError('Timed out waiting to solve Recaptcha')
        }
      }

      await delay(pollingIntervalMs)
    } while (true)
  }
}

let waitFor = async function waitFor(f) {
  while (!f()) await delay(1000)
  return f()
}
