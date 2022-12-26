import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'
import { v4 as uuidv4 } from 'uuid'

import { ChatGPTAPIBrowser } from '../src'

dotenv.config()

/**
 * Demo CLI for testing basic functionality.
 *
 * ```
 * npx tsx demos/demo.ts
 * ```
 */
//__cf_chl_tk=cfPbqzHn8huOGK34h0q6daXcOasTZ7LzCq2qO8Jz7Do-1671786672-0-gaNycGzNCKU
async function main() {
  const email = process.env.OPENAI_EMAIL
  const password = process.env.OPENAI_PASSWORD

  let { sessionToken, clearanceToken } = {
    clearanceToken:
      'k1DnYQ2Mu.SmE_98hfxCyA0oBLOwEDwe2Il4vNU4BRY-1672020131-0-1-26d6bae3.222baa73.31ca379-160',
    sessionToken:
      'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..cOqgwVkpvzAWY5V_.sciQlGUoavNe-ErOlb8eFDl3CBwDaIBI8mGDdlkT7H2HbwwCAy6RnJXh16JjdFC19brMOQ3uceZ374qMUpF9wUawS2H-kOv6AuQdyOaQydrZypCQ4SVxG2jQJtMfuLrfIdE1eoNnJmmRmywRZkmeHoK4q9dZXRnGNpHxig2rQQ7rarFFpHmEC9T2jB6YgAXpnDabBUOHJ2WHQc5juCWeulXOqTnUm5UWXwMgCc70YY9gzf4enG6HCM9cN1bW8mFCyFw1JkkwnEDWyx64IXzAl2_H7H3uHieewrsDD0dj9cNoIQO57f7X76ZYqFZvycROvkDgnn89K8V65FeJQtQBVso53DAmTK8Y_N8GAKsfhVjX1uNQrFim7SvtD0sNbdV95XwXFY67SvhV0g1NPXEtBR2KsoJb12MHJ1ckYscNTRxl8ekItfOdQdsQ6yhARzVbdSFjmqmDaCLy0xUyUctagIl2lSQA7445AJG7h1TJK2e9HEehuhRJ2opbdHxrPavXN3pHIcim1N9iIC7I9hiWUNDjO4VWXBnc7G7IwbkN9cUwsnICB5-6hAIkmPt7aO5bGRzI0VWAqzgQha9-zqSjVg0bb4E8rgQd6l4mDt7knBB23B5mLS4L7jDWChV9IwOZuRXIIjv2mdPULDJ55SEoboG7Vgp3pQ2kPLTQFq0qvTjJCnsZDn59TUHMDYeKYDaaSLoX0CzqFxXmMYpVC6yUlvXtR7ObxhckDEZxfki87tHR_H8zp_CqF15Vrjh21hjSUI42Guiofz6Ex2v8JdAgRy5s09bB8JlwprSPo1pQW4A8u3-DraSJmFoRPe5cyWBX4qzQjI39yNEO9mGGeYgJO2tK-QvZBS8BjEKwIA86_BIfVaSVMzy7M45mKocsCGjY9b_Ausk5e-zXQje9pp90Zp5pbAbPKEUBcoYygA0BWUwkI3s-MQ-RLQlgmiOIlZgVens6RyJ7OBGYGTkrcgqOWl6Vb9Pj-8V2UvRzpAJXXZCMq4_tlYWYoDbTHONFn133-J83b3_Qsa6kBiis5MbzKkaR3WQEmMFZfDScGoGFTVyekNohM5cLnk_l85ieNRFyrPjFucD8_27Nx5AOtwORDrk_xF61xOfrykS1eT2gMaTIH7NYSHot5xPDO74F8eUKvn87R6tYQk_tq6JBanclV5r24UQ1DjLAyWN649oA7InDfKFfK07ySKTu6fcQlrS_koKZD7naGMghEv1wi_OD45fxryX_lGMEJXYdORx9HUpKKGIpebiyqNKu6ca0FSTXCEKirxJQqqdM-56qMhDlf0lchqN7seRhFZmGIJ0-JXbqXGJmmm51dhiJNn8rXJd2N3kpqwae6tDsLtQzMgQAn3_3-d3X98qLOKru3UZfwFlgTvkIzVQcLt59Wh_1U0XEvJW1o85U2QUS2IMNO7mQrz6VJ-y4IhJOXrfthZ4cjNWkyzAhxyKpzfwR261bNjq5WCZyGX5NxUDJ7xHhmV0AQvA-ftXXqNes7qr_8ZdV0U8wMfBQqGGsqj9xpCpba9Klge-tXfdXRLHXSC9JBy494bYRRBslzXW0bO3vsTnNom3T_pNwdSeGZeJ-13ooNjpvqWSozrhsuoBA-DEUp_1cESPtR-YUF1pyzxdh1U2d3RQMUFTgviwy_IQd9OfkQOHBCrG0C3rUTuVL2JgbRd7WCarBx0Ht-p3IvH74YYbOaaWvHNywdnLIRlIp8--GEZidN2zoLl3FAwcAjZ3eYMPkQ1xZlQwCd6boVCVu6UrGB-1ehBBBaH8JxJ4ePipXd2y4AGtcvOpXRG4Fu5Ynto4mFFZlkAyKTPZrLY55PI_PXXPL-RKfM3Ohfukat1qlL_wLEZyY0CahB5s05pJIwGNJdVP5p1ppqj0Lo5269gOSPq4V0yzIHnnCa2JqSd2Nuju0jE3NeTAPQvjrgLcKm0Ljl2yaVGswa5a8SdrjNH2vKwi8VnTzyHfFw_hSmIyznjP3myIbCXU7JYJIWZIDMYi-58FvWoLs3GMhHntoxf1GGhkmyR9u1pXFaVPNYUwsWW4KfNWz9aRU1g8nLD_NyslvO6KsQDenZTCUwhg_utuMBWxYAeTdGdXPSSR81GS8JYIfYA47Tx26-5uEuO-0bSbLCMdsNTa64pn1pMQRK9InAKAWzqODAlntTeEJ8jX-d_78E2zsNUf6M8IXuMvjviZOI-D7WBJXQTA38veIjZ0pFRst3oIKhwlzuk5SmGZORvg_8S8fdEW07M-f3C31HpTtEpxcn5-ERU4UWvz0k-EOezPufeEuLqfiiEjHzXVHdohxdJ-JX8juWhZp9yyQUeHdPEiDUUZklFqhuiEGgA0EyYhSxb2KHi_Txz4KLgg.EghbWXpB-jIR0aPyvN0KaA'
  }

  let time = Date.now()
  const api = new ChatGPTAPIBrowser({
    email,
    password,
    debug: false,
    minimize: false,
    executablePath: process.env.PATH_CHROME,
    sessionToken,
    clearanceToken
  })
  console.log(new Date(), Date.now() - time, 'ChatGPTAPIBrowser done')
  let tryConnect = true
  while (tryConnect) {
    console.log('try connect ....')
    try {
      console.log(new Date(), 'init step 1', 'initSession')
      await api.initSession()
    } catch (e) {
      console.log(e)
    }
    tryConnect = !(await api.getIsAuthenticated())
  }
  console.log(new Date(), 'init step final', 'success run', Date.now() - time)

  sessionToken = api.getSessionToken()
  clearanceToken = api.getClearanceToken()

  console.log(
    new Date(),
    Date.now() - time,
    JSON.stringify(
      {
        clearanceToken: clearanceToken,
        sessionToken: sessionToken
      },
      null,
      2
    )
  )

  console.log(new Date(), 'send 1', 'alo')
  // const prompt0 = 'Write a python version of bubble sort. Do not include example usage.'
  // let prompt0 = 'give me source code of Rabin-Karp Search in Java and example explained detail'
  let prompt0 = 'alo'
  let conversationId
  let messageId = uuidv4()

  let hadSendModeration = false
  let res = await oraPromise(
    api.sendMessage(prompt0, {
      conversationId: conversationId,
      messageId: messageId,
      timeoutMs: 10 * 60 * 1000,
      onProgress: (result) => {
        if (!hadSendModeration) {
          hadSendModeration = true
          api.sendGenTitle({
            input: prompt0,
            conversation_id: result.conversationId,
            message_id: messageId
          })
          api.sendModeration({
            input: prompt0,
            conversation_id: result.conversationId,
            message_id: messageId
          })
        }
        // console.log(new Date(), 'send 1', 'alo', 'onProgress', result.response)
        // console.log(new Date(), 'onProgress ', result)
      }
    }),
    {
      text: prompt0
    }
  )
  conversationId = res.conversationId

  // setTimeout(() => {
  //   api.sendModeration({
  //     input:prompt0,
  //     conversation_id: conversationId,
  //     message_id:messageId,
  //   });
  // },10);
  let sendRep1 = prompt0 + '\n\n' + res.response

  await api.sendModeration({
    input: sendRep1,
    conversation_id: conversationId,
    message_id: res.messageId
  })
  messageId = uuidv4()
  const prompt = 'Write a poem about cats.'

  hadSendModeration = false
  res = await oraPromise(
    api.sendMessage(prompt, {
      conversationId: res.conversationId,
      messageId: res.messageId,
      onProgress: (result) => {
        if (!hadSendModeration) {
          hadSendModeration = true
          api.sendModeration({
            input: prompt,
            conversation_id: result.conversationId,
            message_id: messageId
          })
        }
        // console.log(new Date(), 'send 1', 'alo', 'onProgress', result.response)
        // console.log(new Date(), 'onProgress ', result)
      }
    }),
    {
      text: prompt
    }
  )

  let remod = await api.sendModeration({
    input: sendRep1 + '\n\n' + prompt + '\n\n' + res.response,
    conversation_id: conversationId,
    message_id: res.messageId
  })
  console.log(remod)
  console.log(remod)

  // let resModeration = await api.sendModeration({
  //   input: prompt,
  //   conversation_id: res.conversationId,
  //   message_id: res.id,
  // });
  console.log('\n' + res.response + '\n')

  const prompt2 = 'Can you make it cuter and shorter?'

  res = await oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt2
    }
  )
  console.log('\n' + res.response + '\n')

  // console.log(new Date(), 'send 1', 'alo', 'done', res.response)
  // console.log(new Date(), res.response.length)
  //   console.log(new Date(), 'f5 1', 'starting ...')
  //   let page = api.getPage()
  //   // await page.setCacheEnabled(false);
  //   try {
  //     await api.refreshSession()
  //     // await page.reload({waitUntil: 'networkidle2'});
  //   } catch (e) {
  //     console.error(e)
  //   }
  //   console.log(new Date(), 'f5 1', 'done')
  //   // await api.resetSession()//load lai trang
  //   await api.refreshSession()
  //
  //   console.log(new Date(), 'send 1', 'xin chào', 'send')
  //   prompt0 = 'give me source code of Rabin-Karp Search in Java and example explained detail'
  //   res = await oraPromise(
  //     api.sendMessage(prompt0, {
  //       timeoutMs: 0,
  //       // onProgress: (result) => {
  //       //   console.log(
  //       //     new Date(),
  //       //     'send 1',
  //       //     'xin chào',
  //       //     'onProgress',
  //       //     result.response
  //       //   )
  //       // }
  //     }),
  //     {
  //       text: prompt0
  //     }
  //   )
  // const body = {
  //   input: prompt0,
  //   conversation_id: res.conversationId,
  //   message_id: res.id,
  //   model: 'text-moderation-playground'
  // }
  //
  // let resModeration = await api.sendModeration(body);
  // console.log(resModeration);
  //
  // resModeration = await api.sendModeration({
  //   input: prompt0 +'\n\n' + res.response,
  //   conversation_id: res.conversationId,
  //   message_id: res.messageId,
  // });
  // console.log(resModeration);
  // console.log(resModeration);
  //   console.log(new Date(), 'send 1', 'xin chào', 'done', res.response)
  //
  //   // console.log(new Date(), 'f5 1', 'starting ...')
  //   // page = api.getPage()
  //   // // await page.setCacheEnabled(false);
  //   // try {
  //   //   await page.reload({ waitUntil: 'networkidle2' })
  //   // } catch (e) {
  //   //   console.error(e)
  //   // }
  //   // console.log(new Date(), 'f5 1', 'done')
  // const prompt = 'Write a poem about cats.'
  //
  // res = await oraPromise(api.sendMessage(prompt,{
  //   conversationId:res.conversationId,
  //   messageId:res.messageId
  // }), {
  //   text: prompt
  // })
  //
  //
  // resModeration = await api.sendModeration({
  //   input: prompt,
  //   conversation_id: res.conversationId,
  //   message_id: res.id,
  // });
  // console.log('\n' + res.response + '\n')
  //
  // const prompt2 = 'Can you make it cuter and shorter?'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt2, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt2
  //   }
  // )
  // console.log('\n' + res.response + '\n')
  //
  // const prompt3 = 'Now write it in French.'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt3, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt3
  //   }
  // )
  // console.log('\n' + res.response + '\n')
  //
  // const prompt4 = 'What were we talking about again?'
  //
  // res = await oraPromise(
  //   api.sendMessage(prompt4, {
  //     conversationId: res.conversationId,
  //     parentMessageId: res.messageId
  //   }),
  //   {
  //     text: prompt4
  //   }
  // )
  // console.log('\n' + res.response + '\n')

  // await api.closeSession()
  // close the browser at the end
  // await api.closeSession()
}

main().catch((err) => {
  console.error(err)
  // process.exit(1)
})
