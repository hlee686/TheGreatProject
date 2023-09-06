

import axios from 'axios';

const OPENAI_API_KEY = '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'


export async function splitParagraphIntoSentences(paragraph) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt: `Split the following paragraph into sentences:\n\n${paragraph}\n\n`,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const text = response.data.choices[0].text.trim();
    const sentences = text.split(/[.!?]/).filter(sentence => sentence.trim() !== '');
    return sentences;
  } catch (error) {
    console.error('Error splitting paragraph:', error);
    throw error;
  }
}
