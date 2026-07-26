import type { Story } from '@/types/story';

/**
 * Six fairy tales, each carrying one real idea about artificial intelligence.
 *
 * The rule for every tale: the magic must *be* the concept, not a costume worn
 * over a lecture. A lantern that remembers the paths it has walked is training
 * data. A mirror that has only ever seen roses is biased data. A child should
 * be able to enjoy the story and never notice they were taught something.
 *
 * Written as draft content for review. Per the project plan, educational
 * material should be signed off by the client or a qualified educator before
 * public release.
 */
export const stories: Story[] = [
  {
    slug: 'the-lantern-that-learned-the-way',
    title: 'The Lantern That Learned the Way',
    subtitle: 'A tale of a lamp that remembered every road it walked',
    teaser: 'Nell taught her lantern the forest one evening at a time — and learned what it could not know.',
    concept: 'Learning from examples (training data)',
    conceptExplainer: [
      'Nell’s lantern was not magic. It only ever knew what Nell had shown it, one evening at a time. That is exactly how a computer learns: you give it many, many examples, and it finds the pattern hiding inside them.',
      'The examples you show a computer are called its **training data**. A lantern shown a hundred safe paths glows brightly on safe paths. A computer shown a hundred thousand photographs of cats gets very good at spotting cats.',
      'And the flicker matters just as much. When the stranger asked about a road Nell had never walked, the lantern did not lie — it wavered. A well-made AI should do the same: when it has not seen something before, the honest answer is *I am not sure*.',
    ],
    moral: 'A lantern only knows the roads it has been shown.',
    askSparky: [
      'What is training data?',
      'How does a computer learn from examples?',
      'Why does AI sometimes say it is not sure?',
    ],
    ageGroups: ['explorer', 'builder'],
    readingMinutes: 5,
    image: 'lessons/meet-sparky.webp',
    accent: 'green',
    blocks: [
      {
        kind: 'prose',
        text: 'At the edge of a forest so old it had forgotten its own name, there lived a lamplighter’s daughter called Nell. The forest had a hundred paths, and only a handful of them were kind. The rest led travellers in circles until the moon went down and their courage went with it.',
      },
      {
        kind: 'prose',
        text: 'Nell owned nothing in the world but a small brass lantern with a cracked pane. It was not a magic lantern. It had no opinions at all. It simply burned, the way lanterns do.',
      },
      { kind: 'scene', title: 'One hundred evenings' },
      {
        kind: 'prose',
        text: 'Every evening Nell walked. And every evening, at the mouth of each path, she stopped and told her lantern the truth about it. *This one is kind,* she would say, laying her palm against the warm brass. *It runs beside the stream and comes out by the miller’s gate.* Or: *This one is cruel. It looks wide and it looks easy, and it ends in the bog.*',
      },
      {
        kind: 'prose',
        text: 'The lantern said nothing. But it listened, in the patient way that brass listens, and it remembered.',
      },
      {
        kind: 'prose',
        text: 'After ten evenings, nothing. After fifty, Nell fancied the flame leaned a little — the way a dog’s ear turns — whenever she passed the path by the stream. After a hundred evenings there was no mistaking it. At a kind path the flame stood tall and green-gold and glad. At a cruel one it shrank down small and blue, as if it had caught a chill.',
      },
      {
        kind: 'verse',
        lines: [
          'Show me a road and I will learn it,',
          'Walk me a hundred and I will know.',
          'But do not ask me, in the dark,',
          'For roads you never let me go.',
        ],
      },
      { kind: 'scene', title: 'The stranger at the crossroads' },
      {
        kind: 'prose',
        text: 'One night a stranger came out of the rain with his collar turned up and his boots full of river. He had heard, he said, of a lantern that knew the forest. He wanted the north road — the old drovers’ road, beyond the ridge.',
      },
      {
        kind: 'prose',
        text: 'Nell held the lantern up. The flame did something it had never done before. It guttered. It leaned left, then right, then stood upright and trembled, like a child asked a question in front of the whole school.',
      },
      {
        kind: 'prose',
        text: '“It does not know,” said Nell.',
      },
      {
        kind: 'prose',
        text: '“Then it is a poor sort of magic,” said the stranger.',
      },
      {
        kind: 'prose',
        text: '“It is no sort of magic at all,” said Nell. “It is only as wise as the walking I have done. I have never taken the north road. So it has never learned it, and it will not pretend.” She set the lantern down between them, and it burned steady and uncertain. “A light that guessed would be worse than no light. A light that guessed would put you in the bog and tell you it was a meadow.”',
      },
      {
        kind: 'prose',
        text: 'The stranger looked a long while at the small honest flame. Then he sat down by Nell’s fire until morning, and in the morning they walked the north road together — slowly, carefully, with the lantern held between them.',
      },
      {
        kind: 'whisper',
        text: 'And that evening, at the mouth of the north road, Nell stopped as she always did, laid her palm against the warm brass, and told it the truth about what they had found.',
      },
    ],
  },

  {
    slug: 'the-mirror-that-only-knew-roses',
    title: 'The Mirror That Only Knew Roses',
    subtitle: 'A tale of a looking-glass that had seen too little of the world',
    teaser: 'It could name any flower in the kingdom. It just happened to have grown up in a garden of roses.',
    concept: 'Bias in data',
    conceptExplainer: [
      'The mirror was not broken and it was not lying. It was doing its best with everything it had ever been shown — and everything it had ever been shown was a rose.',
      'When the examples a computer learns from only cover one small corner of the world, it gets everything outside that corner wrong. This is called **bias**, and it is one of the most important problems in AI.',
      'It matters far beyond flowers. A system that has only seen one kind of face, or heard one kind of voice, or read one kind of name, will serve those people well and fail everyone else — confidently, and without ever knowing it is failing.',
      'Tam’s fix is the real fix: go further. Walk to the marsh and the mountain. Bring back the lily, the thistle, and the small grey weed that grows in gutters. A model is only as wide as the world you carry to it.',
    ],
    moral: 'A mirror raised among roses will call the whole world a rose.',
    askSparky: [
      'What does it mean when AI is biased?',
      'Why does AI need lots of different examples?',
      'How can we make AI fairer for everyone?',
    ],
    ageGroups: ['builder', 'creator'],
    readingMinutes: 6,
    image: 'courses/vision-nlp.webp',
    accent: 'purple',
    blocks: [
      {
        kind: 'prose',
        text: 'The Queen of Aurelia loved roses, and being a queen, she was not obliged to love anything else. Her gardens held four thousand rose bushes and not one other growing thing. Gardeners went about on their knees plucking out any green shoot that had the impertinence to be something different.',
      },
      {
        kind: 'prose',
        text: 'In the middle of the garden the Queen hung a tall silver mirror, and she asked of it one gift: that it should be able to name any flower shown to it. The mirror set about learning. All summer it watched. All summer it saw roses — crimson, coral, cream, a hundred shades and a thousand shapes.',
      },
      {
        kind: 'prose',
        text: 'By autumn the mirror was magnificent. “A Damask, three days from opening,” it would murmur, “grown a little too near the wall.” It was never wrong. It was, everyone agreed, the wisest mirror in the world.',
      },
      { kind: 'scene', title: 'The traveller’s lily' },
      {
        kind: 'prose',
        text: 'Then a traveller came through the gate with a white lily in her hand, and held it up, and asked the mirror what it was.',
      },
      {
        kind: 'prose',
        text: 'The mirror considered. The silver rippled. And it said, with complete confidence:',
      },
      {
        kind: 'verse',
        lines: [
          '“A rose. A most unusual rose —',
          'too white, too tall, too plainly dressed,',
          'with far too few and lonely petals.',
          'A poor rose. But a rose, at best.”',
        ],
      },
      {
        kind: 'prose',
        text: 'The traveller laughed. The Queen did not. The gardeners looked at their boots, because a gardener knows a lily when he sees one, and it is a hard thing to watch the wisest mirror in the world be so grandly, so certainly wrong.',
      },
      { kind: 'scene', title: 'What Tam did' },
      {
        kind: 'prose',
        text: 'The gardener’s boy was called Tam, and he was not clever, but he was curious, which is better. That night he took the mirror down off its post, wrapped it in sacking, and carried it out of the gate.',
      },
      {
        kind: 'prose',
        text: 'He carried it to the water-meadow, where the flag iris stands in the mud like a yellow flame. He carried it to the marsh, where sundew eats flies and asks no one’s permission. He carried it up the scree to the mountain saxifrage, which is smaller than a fingernail and tougher than the mountain. He carried it down to the town and held it over a crack in the cobbles where one grey weed had made a life for itself.',
      },
      {
        kind: 'prose',
        text: 'It took him a year and it wore out two pairs of boots.',
      },
      {
        kind: 'prose',
        text: 'When Tam brought the mirror home it was quieter than before. It hesitated more. It said *I think* and *perhaps* and, once or twice, *I have not met this one — tell me its name.* The Queen thought it much diminished.',
      },
      {
        kind: 'whisper',
        text: 'But when the traveller came back through the gate with her lily, the mirror said: “A lily. Good evening. And you have walked a long way, because there is marsh-mud on your hem, and I know marsh-mud now.”',
      },
    ],
  },

  {
    slug: 'the-baker-who-sorted-the-starfruit',
    title: 'The Baker Who Sorted the Starfruit',
    subtitle: 'A tale of an old woman who taught a boy what to look at',
    teaser: 'Anyone can be told which fruit is which. Baba Rilla taught Pim something better.',
    concept: 'Classification and features',
    conceptExplainer: [
      'Baba Rilla could have simply told Pim the answer for each fruit, one by one. Instead she taught him what to *look at* — points, weight, smell, the sound it makes when tapped.',
      'Those things are called **features**, and choosing good ones is most of the work. Sorting things into groups using their features is called **classification**, and it is one of the jobs computers do best: spam or not spam, cat or dog, ripe or unripe.',
      'Pim’s mistake at the end is the interesting part. Colour looked like a wonderful feature — it worked perfectly all through the golden autumn. Then the light changed, and it stopped working. A feature that only holds in one place, or one season, will let you down the moment the world moves.',
    ],
    moral: 'To sort well, first learn what is worth looking at.',
    askSparky: [
      'What does it mean to classify something?',
      'How does a computer tell a cat from a dog?',
      'What is a feature in machine learning?',
    ],
    ageGroups: ['explorer', 'builder'],
    readingMinutes: 4,
    image: 'courses/data-science.webp',
    accent: 'orange',
    blocks: [
      {
        kind: 'prose',
        text: 'Every autumn, starfruit fell on the village of Little Ember. They came down soft as snow all through the last week of October, and they were of three kinds, and the difference mattered enormously.',
      },
      {
        kind: 'prose',
        text: 'Goldstars made bread that made you brave. Palestars made bread that made you sleepy, which was excellent at bedtime and a disaster before market day. And Ashstars made bread that made you hiccup for a fortnight.',
      },
      {
        kind: 'prose',
        text: 'Baba Rilla had sorted starfruit for sixty-one years, and she had never once got it wrong. That autumn she took an apprentice, a long-legged boy called Pim, because her hands had begun to shake.',
      },
      { kind: 'scene', title: 'Four things to look at' },
      {
        kind: 'prose',
        text: 'Pim expected to be told which was which. He held up a fruit and waited. Baba Rilla did not tell him. She folded her arms and said, “How many points?”',
      },
      {
        kind: 'prose',
        text: '“Five.”',
      },
      {
        kind: 'prose',
        text: '“Weigh it in your palm. Heavy or light for its size?”',
      },
      {
        kind: 'prose',
        text: '“Heavy.”',
      },
      {
        kind: 'prose',
        text: '“Smell the stem end. Tap it with your thumbnail. Now — what have you got?”',
      },
      {
        kind: 'verse',
        lines: [
          'Five points and heavy, sweet and ringing: Goldstar.',
          'Six points and light, and dull to the nail: Palestar.',
          'Seven points, and a smell like a wet coin: Ashstar.',
          'Learn the looking, and the naming comes free.',
        ],
      },
      {
        kind: 'prose',
        text: 'By the end of the first week Pim could sort a basket without slowing down. By the end of the second he could do it in the dark, because points and weight and smell and sound do not need daylight.',
      },
      { kind: 'scene', title: 'The trouble with a lucky rule' },
      {
        kind: 'prose',
        text: 'Now, Pim had noticed something Baba Rilla had never mentioned. All that autumn, the Goldstars simply *looked* gold. He could tell them across the room. He stopped counting points. He stopped tapping. Why bother, when the colour did it for you?',
      },
      {
        kind: 'prose',
        text: 'It worked beautifully for nineteen days. On the twentieth the weather turned, and the sky went the colour of old pewter, and the light in the sorting shed turned everything a flat and identical grey.',
      },
      {
        kind: 'prose',
        text: 'Pim stood over the baskets with his hands hovering and his stomach cold, because he had stopped learning the looking and started trusting a trick.',
      },
      {
        kind: 'whisper',
        text: 'Baba Rilla did not scold him. She put a fruit in his hand, closed his fingers round it, and said: “Good. Now count.”',
      },
    ],
  },

  {
    slug: 'wren-and-the-whispering-wood',
    title: 'Wren and the Whispering Wood',
    subtitle: 'A tale of a forest that heard every word and understood none of them',
    teaser: 'The wood did exactly what Wren asked. That was the whole problem.',
    concept: 'Understanding language and intent',
    conceptExplainer: [
      'The wood had no trouble hearing Wren. It had trouble understanding her. Words are slippery: *give me a hand*, *it is raining cats and dogs*, *could you crack a window*. We say one thing and mean another all day long, and we barely notice.',
      'Teaching a computer to work out what someone *means* — not merely what they typed — is called **natural language processing**, and it is how Sparky understands your questions.',
      'Wren’s discovery is the one that matters: the wood improved when she gave it **context**. Who is speaking, what came before, what they are trying to do. Context is the river under the words, and without it even a perfect listener drifts.',
    ],
    moral: 'Words are little boats. Meaning is the river underneath.',
    askSparky: [
      'How does AI understand what I am asking?',
      'Why does AI sometimes misunderstand me?',
      'What is natural language processing?',
    ],
    ageGroups: ['builder', 'creator'],
    readingMinutes: 5,
    image: 'stories/whispering-wood.webp',
    accent: 'blue',
    blocks: [
      {
        kind: 'prose',
        text: 'Wren was the only person in three valleys who could speak to the Whispering Wood, and everyone envied her for it, and nobody should have.',
      },
      {
        kind: 'prose',
        text: 'The wood listened perfectly. That was the trouble. It heard every single word and it took each one exactly as it came, the way a very literal and very earnest giant might.',
      },
      { kind: 'scene', title: 'A catalogue of small disasters' },
      {
        kind: 'prose',
        text: 'When Wren, struggling with a fallen gate, said *give me a hand,* the wood grew her a hand: five knuckled branches on a trunk, opening and closing hopefully. It was very proud of it. It kept it for years.',
      },
      {
        kind: 'prose',
        text: 'When she said the rain was *coming down in buckets,* the wood, alarmed, spent a difficult night trying to work out where to put the buckets.',
      },
      {
        kind: 'prose',
        text: 'And when she stood at the edge of the trees at dusk, tired and cold and a long way from her own door, and said — not really to anyone — *I just want to go home,* the wood took her at her word and opened a path. It was the shortest path. It went straight through the bog.',
      },
      {
        kind: 'verse',
        lines: [
          'I hear you, said the wood, I hear you plain,',
          'each word as round and whole as a stone.',
          'But which of all the things a word can mean',
          'did you mean, when you spoke to me alone?',
        ],
      },
      { kind: 'scene', title: 'What Wren changed' },
      {
        kind: 'prose',
        text: 'Wren sat on a root with wet boots and thought about it for a long time. And what she worked out was this: she had been giving the wood her words and keeping everything else to herself.',
      },
      {
        kind: 'prose',
        text: 'So she began to talk differently. Not more loudly — more *around* things.',
      },
      {
        kind: 'prose',
        text: '“I am tired,” she told it, “and it is nearly dark, and my mother will be at the window by now, and I would rather arrive late and dry than early and drowned. When I say *home*, that is what is underneath it.”',
      },
      {
        kind: 'prose',
        text: 'The wood was quiet for a moment, the way a listener is quiet when something has genuinely landed. Then, slowly, it opened a longer path along the ridge, dry the whole way, with the last of the light on it.',
      },
      {
        kind: 'whisper',
        text: 'It never did take down the hand. Wren rather liked it. She hangs her lantern on it, on the evenings she walks late.',
      },
    ],
  },

  {
    slug: 'the-clockwork-nightingale',
    title: 'The Clockwork Nightingale',
    subtitle: 'A tale of a bird made of brass and a hundred years of listening',
    teaser: 'It sang a song no bird had ever sung. The palace argued for a week about whose song it was.',
    concept: 'Generative AI, patterns, and credit',
    conceptExplainer: [
      'The nightingale did not invent its song out of nothing. It had listened to thousands of real birds, learned the shapes their songs tend to take, and then made something new in that shape. That is, very nearly, how **generative AI** works — the tools that write, draw, and compose.',
      'It is genuinely new: no bird had sung that exact song. And it is genuinely made of others: every phrase in it came from somewhere. Both things are true at once, which is why the palace argued for a week.',
      'The gardener’s answer is the honest one, and it is worth holding on to. When you make something with AI, you are standing on an enormous pile of other people’s work. Saying so — naming what you built on — is not a weakness. It is simply telling the truth about how the song got made.',
    ],
    moral: 'A song made of everyone belongs a little to everyone.',
    askSparky: [
      'How does AI make new pictures and stories?',
      'Is AI art really new?',
      'Should I say when I used AI to make something?',
    ],
    ageGroups: ['creator'],
    readingMinutes: 6,
    image: 'lessons/ai-art-studio.webp',
    accent: 'purple',
    blocks: [
      {
        kind: 'prose',
        text: 'In the emperor’s garden there stood a cage with no door, and in the cage sat a nightingale made of brass and blue enamel. It had been put there a hundred years before by a clockmaker whose name nobody had thought to write down.',
      },
      {
        kind: 'prose',
        text: 'The bird did not sing. It only listened. That was its whole design: to sit in the garden, year upon year, and take in every song that passed through.',
      },
      {
        kind: 'prose',
        text: 'And a great many passed through. Nightingales and blackbirds. Thrushes that repeat themselves twice to be sure. Geese going over in November. A washerwoman who sang badly and constantly for thirty years. A boy practising a flute, very slowly getting better.',
      },
      { kind: 'scene', title: 'The hundredth spring' },
      {
        kind: 'prose',
        text: 'On the first warm evening of the hundredth spring, something in the brass bird turned over with a click you could hear across the lawn. And it opened its beak and sang.',
      },
      {
        kind: 'prose',
        text: 'The song was not a nightingale’s. It was not a blackbird’s. It had the long silver run of a thrush in it, and a lift at the end that belonged to the geese, and somewhere in the middle a small stubborn phrase that was unmistakably the washerwoman. It went on for eleven minutes. Three of the court wept, and one of them was the Chancellor, who had not wept since childhood and was extremely annoyed about it.',
      },
      {
        kind: 'verse',
        lines: [
          'I am the thrush and I am the goose,',
          'I am the woman at her tub,',
          'I am the boy who could not play',
          'and played until he could.',
        ],
      },
      { kind: 'scene', title: 'The week of arguing' },
      {
        kind: 'prose',
        text: 'The palace argued for seven days.',
      },
      {
        kind: 'prose',
        text: 'The Chancellor said the song belonged to the emperor, since the garden did. The clockmakers’ guild said it belonged to the clockmaker, whose name was still nobody’s idea. A visiting poet said it belonged to no one, being merely an echo, and was therefore worth nothing — though he had wept along with the rest and hoped no one had noticed.',
      },
      {
        kind: 'prose',
        text: 'The gardener, who was sweeping and had not been asked, said: “It is made of every bird that ever came through here, and of none of them. That is not nothing. But it is not the bird’s alone, either.”',
      },
      {
        kind: 'prose',
        text: 'Everyone told her that was no answer. She kept sweeping, having noticed that it was.',
      },
      {
        kind: 'whisper',
        text: 'They put a small brass plate on the cage in the end. It reads: *Sung by the nightingale. Taught by everything that ever sang in this garden.* The washerwoman’s granddaughter comes to read it sometimes.',
      },
    ],
  },

  {
    slug: 'the-two-guardians-of-the-amber-bridge',
    title: 'The Two Guardians of the Amber Bridge',
    subtitle: 'A tale of one guardian who knew the rule and one who asked what it was for',
    teaser: 'The rule was clear, and Ferrum followed it perfectly. That is how the trouble began.',
    concept: 'AI ethics and human judgement',
    conceptExplainer: [
      'Ferrum did nothing wrong, exactly. He followed his instruction precisely and without exception — which is what machines are extraordinarily good at, and why we trust them with so much.',
      'But a rule is written by people, at one moment, for one purpose. The people who wrote *no iron across the bridge* were thinking of soldiers. They were not thinking of a child with a key. No rule can imagine every situation it will ever meet.',
      'This is why serious AI systems keep people in the loop: someone who can ask *what was this rule for?*, notice when following it causes harm, and be answerable for the decision. Mira’s last act matters as much as her first — she did not quietly bend the rule and hide it. She wrote it down and told someone.',
      'The goal is not an AI that ignores its rules. It is people who stay responsible for them.',
    ],
    moral: 'A rule is a fine servant and a poor master.',
    askSparky: [
      'Why do people need to check what AI decides?',
      'Can AI understand right and wrong?',
      'What are AI ethics?',
    ],
    ageGroups: ['creator'],
    readingMinutes: 6,
    image: 'lessons/smart-city.webp',
    accent: 'green',
    blocks: [
      {
        kind: 'prose',
        text: 'The Amber Bridge was the only crossing for forty miles, and two guardians stood at its foot. They had been made in the same workshop, in the same year, out of the same grey stone.',
      },
      {
        kind: 'prose',
        text: 'Ferrum stood on the left. He knew the rule and he kept it, in every weather, without exception, and he was rightly famous for it.',
      },
      {
        kind: 'prose',
        text: 'Mira stood on the right. She knew the rule too. She also knew a thing Ferrum considered irrelevant: who had written it, and what had been happening in the world on the day they did.',
      },
      {
        kind: 'prose',
        text: 'The rule was one line long. **None may cross the bridge who carries iron.**',
      },
      { kind: 'scene', title: 'The girl with the key' },
      {
        kind: 'prose',
        text: 'One evening in the wet part of the year, a girl came down the road at a run. She was perhaps nine. She was carrying, on a string round her neck, a black iron key nearly as long as her forearm.',
      },
      {
        kind: 'prose',
        text: 'Her grandmother was ill on the far side, she said, and the key opened the medicine chest, and there was no other key and no other bridge.',
      },
      {
        kind: 'prose',
        text: 'Ferrum did not hesitate, because hesitating was not among the things he did. “None may cross who carries iron,” he said. “I am sorry. The rule is the rule.” And he stood across the way, and he was immovable, and he was entirely correct.',
      },
      {
        kind: 'verse',
        lines: [
          'The rule is the rule, said the guardian of stone,',
          'and stone is a very good keeper.',
          'But who wrote the rule, and what did they fear,',
          'and would they have feared this creature?',
        ],
      },
      { kind: 'scene', title: 'What Mira asked' },
      {
        kind: 'prose',
        text: 'Mira turned her head, which she did rarely, and asked a question instead of giving an answer.',
      },
      {
        kind: 'prose',
        text: '“Why iron, Ferrum?”',
      },
      {
        kind: 'prose',
        text: '“Because the rule says iron.”',
      },
      {
        kind: 'prose',
        text: '“That is what it says. I asked why.” And when he had no answer, she gave it. “It was written in the year of the border war. It was written to stop armed men crossing in the night. Iron meant swords. It has always meant swords.” She looked down at the girl, and at the key, and at the string it hung on. “It has never once meant this.”',
      },
      {
        kind: 'prose',
        text: 'Ferrum said that a rule with a hole in it is not a rule at all, and there is real weight in that, and Mira did not pretend otherwise.',
      },
      {
        kind: 'prose',
        text: 'She stood aside and let the girl run. Then she did the part that people forget when they tell this story: she took out the bridge ledger and wrote down the date, the girl’s name, the key, her reason, and her own name beneath it. And at first light she sent the page up to the magistrates, who were people, and who could be argued with, and who would have to answer for what they decided next.',
      },
      {
        kind: 'whisper',
        text: 'The rule reads differently now. It is four lines instead of one, and the fourth line begins: *Except where a guardian, giving her name and her reason, judges otherwise —* which is a longer rule, and a slower one, and it has not put a single sword across the Amber Bridge.',
      },
    ],
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
