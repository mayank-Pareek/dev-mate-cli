import 'dotenv/config';
import aiConnection from './connection';

const chat = async () => {
  if (aiConnection)
    try {
      const completion = await aiConnection.chat.completions.create({
        model: 'google/gemma-2-9b-it:free',
        messages: [{ role: 'user', content: 'Hi' }],
        temperature: 1.1,
      });
      console.log(completion.choices[0].message.content);
    } catch (error: any) {
      if (error.code === 400) {
        console.error(
          'Model abc is not available, choose another model or leave blank for default',
        );
      } else {
        console.error(error);
      }
    }
};

chat();
