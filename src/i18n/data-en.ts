/* Dicionário dos dados — inglês britânico para os campos de texto de cada tabela.
   localizeData() troca os campos em memória, na ordem dos arrays; o português
   continua sendo a fonte em src/data. A palavra do léxico que aponta para uma
   intenção, campo, cultura, música ou lente é traduzida junto (lexFrag). */
import { EMO } from '../data/emotions';
import { MKT } from '../data/markets';
import { SCH } from '../data/schemes';
import { LENS } from '../data/lenses';
import { CULT } from '../data/cultures';
import { MUS, CVDLIST } from '../data/music';
import { CLS, FONTS, USES, STRATS, WIDTHS, CONTRS, BANKS, ROLES, CASES } from '../data/fonts';
import { PIECES, SUPS, LEX, ANGLES } from '../data/lexicon';
import { TREND, AXES } from '../data/trends';
import { ANCHORS } from '../core/goethe';

const emo: [string, string][] = [
  ['None', 'With no declared intention, the starting hue comes only from the field\'s convention, the cultural reference and wherever the balls sit on the ring.'],
  ['Joy and clarity', 'Yellow is the colour nearest to light. In its pure, clear state, says Goethe, it carries a serene, cheerful, gently exciting nature — but sully it a little and that same cheer turns to disgrace.'],
  ['Warm optimism', 'Intensifying yellow towards red gives it warmth without yet giving it violence. It is the region where the eye feels welcomed rather than pressed.'],
  ['Energy and urgency', 'Red-yellow is the active side at its greatest energy. Goethe notes that animals grow irritated before it and that sensitive people cannot bear it for long — which is exactly the point when you want to force an action.'],
  ['Desire and appetite', 'Here intensification already borders on the unbearable. It is the band that calls the body before it calls judgement.'],
  ['Authority and gravity', 'Purple is the summit of intensification: in it the two sides of the circle meet. Goethe attributes dignity and gravity to it, and notes it was no accident that it was the colour of those who govern.'],
  ['Ceremony and legacy', 'Purple pulled towards dark. Goethe describes it as severity and grace at once — the same colour that imposes is the one that enchants.'],
  ['Aspiration and restlessness', 'Red-blue is restless and aspiring. Goethe describes it as something that does not settle: it wants to keep climbing.'],
  ['Mystery and transcendence', 'The intensified negative side. Colour stops describing the world and starts suggesting what lies behind it.'],
  ['Depth and distance', 'Blue carries a principle of darkness. Goethe says it draws us in and at the same time pulls us away — like a beautiful nothing that recedes as one looks.'],
  ['Trust and serenity', 'Blue pushed towards green: the contradiction between excitement and repose that Goethe attributes to blue begins to resolve in favour of repose.'],
  ['Melancholy and longing', 'Cold, sombre blue. Goethe links this side to a feeling of absence that never quite becomes unpleasant.'],
  ['Rest and balance', 'In green, says Goethe, eye and soul rest. One does not wish to go further, and cannot — the one point on the circle where the search ends.'],
  ['Care and regeneration', 'Green with yellow inside it. The repose of green takes back a share of the activity of light, without turning into stimulus.'],
  ['Rigour and precision', 'Blue-green of restrained chroma. Nothing in this band asks for attention; it reads as method.'],
  ['Abundance and plenty', 'Yellow pulled towards green, with high chroma. The sense of excess comes less from the hue than from the saturation it can bear.'],
  ['Intimacy and warmth', 'Purple pulled towards red and lowered in lightness. Goethe notes that this neighbourhood has grace without losing gravity.'],
  ["Nostalgia and tenderness", "A yellow already pulled towards red and lowered, the colour of late-afternoon light and aged paper. Goethe says intensified yellow brings warmth without violence; here the warmth comes with the distance of time, and so it moves rather than stirs."],
  ["Courage and assertion", "Red-yellow at its firmest band, before it turns into appetite. It is the colour Goethe describes as advancing on the viewer; used in a contained area it stops being a threat and becomes a decision."],
  ["Reverence and the sacred", "Purple at the point where blue still holds it. Goethe gives this colour dignity and gravity, and a purple glass, he says, shows the world as on the Day of Judgement. It is the colour of mantles, altars and what is not touched."],
  ["Wonder and awe", "Between blue and red-blue, where the eye neither rests nor decides. Goethe sees in blue something that recedes and attracts at once; pulled towards violet, that movement becomes luminous unease, the feeling of standing before something larger."],
  ["Silence and contemplation", "Greenish blue with almost all the chroma withdrawn. Nothing advances, nothing calls. It is the region Goethe associates with the eye at rest as green approaches blue: the colour of a still lake at dawn."],
  ["Hope and beginning again", "Green pulled towards yellow, the colour of the shoot before the leaf. Goethe says that in green the eye and the soul rest; with a little yellow, that rest gains direction and becomes promise."],
  ["Grief and farewell", "Deep blue, lowered almost to darkness. For Goethe blue carries a principle of darkness and always pulls away; here it is the distance of someone who has gone. Cultures dress mourning in black or white, but the feeling has this colour."],
  ["Eroticism and skin", "Purple pulled towards red, warmed and with high chroma. It is the band Goethe calls grace and charm together with gravity: it calls the body with elegance, without the urgency of red-yellow."],
  ["Freedom and vastness", "The blue of the high sky, clear and open. Goethe describes blue as the colour that moves away and draws us after it: it is the horizon, the sea seen from afar, everything that has no edge yet."],
  ["Humour and irony", "Slightly greenish yellow, more acid than cheerful. Goethe warns that it takes little dirt for yellow's joy to turn to disgrace; irony lives exactly on that margin, and knows it."],
  ["Roots and belonging", "Red-yellow darkened to ochre, the colour of earth, clay and bread. It is the first colour humans made, and Goethe places it on the active, warm side of the circle: here, warmed and lowered, it becomes ground."],
  ["Vertigo and ecstasy", "Magenta with chroma at the edge of the gamut. Goethe describes the meeting of the two sides in purple as the summit; pushed to the end, the summit becomes a precipice, and the eye does not know whether it rises or falls."],
  ["Wisdom and time", "Closed, unshining blue-green, the colour of old bronze and deep water. On the passive side of Goethe's circle, it is the colour that asks for nothing: it has seen enough not to need to convince."],
  ["Relief and lightness", "Light green pulled towards yellow, with much light and little chroma. It is Goethe's rest after an effort: the colour of stepping out of a closed room into the air."]
];
const mkt: [string, string, string][] = [
  ['None', 'none', 'With no declared field, nothing pulls the hue towards ground already occupied by others — the result comes from intention and geometry, not from a contested territory.'],
  ['Finance and banking', 'institutional blue', 'Blue dominates the sector because it promises distance and coolness — exactly what Goethe describes. That is why it stopped meaning anything: everyone uses it.'],
  ['Fintech and crypto', 'violet and gradient', 'The category migrated wholesale to red-blue. Standing out today costs more than joining in.'],
  ['Climate and regeneration', 'restful green', 'Green says rest, not transformation. For a field whose thesis is systemic change, the convention works against the message.'],
  ['Bioeconomy and agriculture', 'green with earth', 'A solid, little-contested convention; the useful break is usually in chroma, not hue.'],
  ['Health and care', 'clinical blue', 'Low-chroma blue-green. Gains credibility and loses warmth — a well-known trade.'],
  ['Wellbeing and longevity', 'soft green and neutrals', 'A category saturated with desaturation. Beige with sage became the sector\'s commonplace.'],
  ['Food and drink', 'red-yellow', 'The active side at high energy works because it acts on the body before judgement. It is also the most contested.'],
  ['Luxury and jewellery', 'purple and black', 'The field where black is already treated as a colour, not a background. The gravity of purple is the historical choice.'],
  ['Fashion', 'black and the far end of the circle', 'Tolerates any hue because the system is carried by black and white.'],
  ['Technology and software', 'blue and violet', 'The convention is so thick that anything outside it already reads as a position.'],
  ['Tourism and hospitality', 'destination blue-green', 'Sea and leaf. Works at the destination and fails on the piece, because it does not tell one place from another.'],
  ['Transformational travel', 'violet and earth tones', 'A young category with a still-soft convention — where breaking away costs least.'],
  ['Energy and infrastructure', 'orange and yellow', 'An inheritance of industrial safety. Yellow here is not joy: it is signage.'],
  ['Education', 'yellow and blue', 'The characteristic yellow-and-blue pair is the sector\'s oldest and still works.'],
  ['Media and culture', 'purple and black', 'A field that rewards contrast of value more than of hue.'],
  ['Public sector and NGOs', 'institutional blue', 'A defensive convention. Breaking it here means sustaining the break for years.'],
  ['Art and editorial', 'black, white and one accent', 'The content carries the system. Colour comes in as punctuation, not structure.'],
  ['Property and architecture', 'green and warm neutrals', 'Low chroma by default; differentiation usually comes from the chosen black.'],
  ['Retail and e-commerce', 'conversion red', 'Red-yellow sells because it presses. Used all the time, it stops pressing.'],
];
const sch: [string, string][] = [
  ['None — free', 'The balls stay wherever you leave them. Nothing is forced to keep its distance.'],
  ['Goethe — harmonious', 'The opposites of the circle: the combination which, according to Goethe, carries within it the condition of totality.'],
  ['Goethe — characteristic', 'One space apart. It says something, though not everything.'],
  ['Goethe — characterless', 'Neighbours on the circle. Not displeasing, but by his account they lack character.'],
  ['Monochromatic', 'One hue only, varying lightness and chroma. The whole hierarchy comes from value.'],
  ['Analogous', 'A narrow neighbourhood. Cohesive and without tension; needs contrast of value not to go flat.'],
  ['Complementary', 'Crosses the circle. Maximum hue tension between two poles.'],
  ['Split-complementary', 'Swaps the opposite for its two neighbours. Keeps the tension and softens the clash.'],
  ['Triadic', 'Divides the circle in three. Lively and balanced, hard to dose by area.'],
  ['Tetradic', 'A rectangle on the circle: two pairs of opposites. Rich, and the hardest to balance.'],
  ['Square', 'Four equidistant points. A symmetrical tetrad, with the same demand for dosing.'],
];
const lens: [string, string][] = [
  ['None', 'With no declared method, the palette distributes lightness and area evenly, favouring neither restraint nor volume.'],
  ['Pentagram — London and New York', 'They know how to be loud, but almost always choose clarity: type carries the system and colour comes in a single dose. Hence the work ages well while the rest chases the trend cycle.'],
  ['Wolff Olins — London and New York', 'Hired when the market needs to notice that something has really changed. Colour comes in at high volume and is treated as a property of the system, not an accent.'],
  ['COLLINS — New York and San Francisco', 'Chromatic maximalism: the whole system is the palette, not one colour with supports. Works when there is enough surface to show variation.'],
  ['PORTO ROCHA — New York and London', 'Founded by two Brazilians and an editorial reference within a few years. High value contrast, strong art direction, colour in service of the concept.'],
  ['Koto — London and New York', 'A clean digital system, built to scale in product. The palette comes as a tonal scale, not a set of loose colours.'],
  ['Jones Knowles Ritchie — London and New York', 'Shelf discipline: colour has to win at three metres and against the competitor beside it. High saturation and a hard edge.'],
  ['Studio Dumbar — Rotterdam', 'Identity thought in motion before it is thought still. Hard colours on a dark ground, because the system will live on screen.'],
  ['Chermayeff & Geismar & Haviv — New York', 'The house of the symbols that crossed decades. Flat reduction: two colours and the form resolve it, and what is left is subtracted.'],
  ['Landor — global network', 'Multi-market programmes with long governance and research. The deviation from what already exists is small on purpose: it protects accumulated value.'],
  ['Mucho — Barcelona and San Francisco', 'Restrained European modernism: visible grid, closed palette, nothing to spare. Colour used as structure, not as declared emotion.'],
  ['Experimental Jetset — Amsterdam', 'Black, white and one colour. Living proof that Goethe\'s two poles are full colours: here they do almost all the work and hue comes in as an event.'],
  ['&Walsh — New York', 'Expressive and saturated, with deliberately high value contrast. The palette is a character.'],
  ['DixonBaxi — London', 'The best choice when the system must work in motion and on screen. Dark ground by default, because that is where it will be seen.'],
  ['Ragged Edge — London', 'Opinionated work: colour takes sides and accepts alienating part of the audience. There is no lukewarm version.'],
  ['Pearlfisher — London and New York', 'The craft of packaging: desaturated colour, a sense of material, finish above impact.'],
  ['Interbrand and Siegel+Gale — global network', 'The discipline is to simplify: few tokens, accessibility solved at the source, a system that survives being implemented badly.'],
];
const cult: [string, string][] = [
  ['None', ''],
  ['Aotearoa — kōkōwai, pango, mā', 'Kōkōwai is the red ochre of iron-rich clay and sandstone, burnt and ground, then mixed with shark-liver or tītoki oil. Polynesian tradition links red to kura — something precious — and what was painted red became tapu. Pango and mā are not background: they are principles, and the white came from burnt shell or clay, which is why it is warm.'],
  ['Indigenous Amazon — urucum, jenipapo, tabatinga', 'The red comes from urucum pulp, the dark blue and black from fermented jenipapo juice — whose Guarani name means fruit that serves for painting — and the white from tabatinga or limestone. Among the Kayapó, red bears witness to social life and black is the colour of creativity; body painting signals age, children and status, and is not only ritual: it is also aesthetic pleasure.'],
  ['Japan — aizome, sumi, kurenai', 'Vat indigo, soot ink and a red that appears rarely and in small area. The logic is not of hue but of interval: low chroma in almost everything, so that an event of colour carries weight.'],
  ['West Africa — adire indigo, kente gold', 'Tie- and starch-resist indigo against gold and red woven in strips. Strong colours that coexist because structure separates them — the weave does the work a grid would do.'],
  ['Andes — cochineal and indigo', 'Cochineal carmine and indigo in wool. The pair lives on hue contrast at similar lightness — the opposite of what Western design usually does.'],
  ['Mediterranean — lime and blue', 'Lime dominates the area and blue comes in as a small cut-out. A palette of proportion, not of quantity of colours.'],
  ['Nordic — low light', 'High latitude, long diffuse light. Restrained chroma and a narrow lightness band: nothing shines because nothing needs to compete with strong sun.'],
  ['Mexico — Barragán', 'Pink, yellow and blue across whole planes of wall. Colour is architecture: it does not decorate surface, it defines volume and shadow.'],
  ['India — sindoor, saffron, indigo', 'Red, saffron and indigo at high saturation and without transition. The neighbourhood of full colours is the rule, not an exception to manage.'],
  ['Bauhaus — primaries and plane', 'Red, yellow and blue treated as material, on white and black. The premise is Goethe inverted: colour serves form, and form is geometric.'],
  ["Morocco — zellige, saffron, Majorelle blue", "Hand-cut tile in cobalt, green and white against earthen walls, and a saffron that comes from the market, not the paint tin. The intense blue of Marrakech was named after a French painter, but the glaze that precedes it is from the fourteenth century. The logic is repetition: colour gains strength by being cut into pieces and repeated without end."],
  ["Korea — obangsaek, the five colours", "Blue, red, yellow, white and black, each tied to a direction, an element and a season. They appear on the sleeve stripes of children's hanbok, on temple cords and in food. It is not a palette of harmony: it is a system of the world, and all five must be present for the set to be complete."],
  ["China — vermilion and jade", "The cinnabar red of gates and seals, and the green of jade, the stone worth more than gold. Red is luck and festival; jade is virtue and permanence. The pair lives on contrast of hue and value at once, with the black of ink as a third voice."],
  ["Mali — bogolan, fermented mud", "Cotton cloth dyed with tree bark and painted with fermented river mud, which fixes the black through iron. Ochre, black and the raw cotton, in symbols that tell village stories. The chroma is low because it comes from the earth, and the strength lies in the drawing, not the colour."],
  ["Portugal — cobalt azulejo on white", "A single blue, cobalt, over tin white, covering churches, stations and kitchens since the seventeenth century. It is a palette of one colour and much area: white does the work of light, and blue draws. Where there is a second colour it is yellow, and it enters in small area."],
  ["Ancient Egypt — Egyptian blue, ochre, gold", "The first synthetic pigment in history, a copper-calcium silicate fired four thousand years ago, beside the ochre of the walls and the gold of the masks. Colours were fixed by meaning: the blue of river and sky, the green of rebirth, the red of desert and danger. The palette is a vocabulary, not a taste."],
  ["Persia — miniature and lapis lazuli", "In the miniatures of Herat and Tabriz, ground lapis lazuli blue fills the whole sky, gold enters as leaf, and pink and green come in small gardens. Flat colours, without shadow, side by side: depth is made by overlap, not by gradient."],
  ["Guatemala — Maya huipil", "Blouses woven on a backstrap loom, with colours that identify the village of the wearer. Magenta, red, yellow and blue at full saturation, separated by bands of pattern. The rule is the neighbourhood of full colours: nothing is lowered so that another colour can appear."],
  ["Java — sogan batik", "Hand-drawn wax and dye baths in indigo and sogan, the tree-bark brown of the batiks of Yogyakarta and Solo. Cream, brown and dark blue, with the pattern held in reserve. It is a palette of three values and low chroma, made to be read up close."],
  ["Scotland — tartan", "Dyed threads crossed in a fixed sequence, the same pattern in warp and weft. Green, blue and red darkened by the crossing: where two colours overlap, a third is born. The mixing happens in the cloth, and the eye completes it from a distance."],
  ["Turkey — İznik", "Sixteenth-century Ottoman ceramics: cobalt, turquoise and a raised tomato red, over white. Tulips, carnations and pomegranates in black outline. White is the largest area; the three colours enter as drawing and balance each other by being equally saturated."],
  ["Aboriginal Australia — desert ochres", "Red ochre, yellow ochre, charcoal and white clay, ground and mixed with water or sap, in dots and lines that map country and story. The colours come from specific places, traded for thousands of years. The dot is the unit: colour exists in accumulation, not in flat area."],
  ["Brazil — cerrado and sertão", "Red clay, straw, the grey-green of the caatinga and the washed blue of a dry-season sky. Low-chroma, high-light colours, seen in Jequitinhonha ceramics, in leather and on lime-painted façades. The palette is of earth and time, and what shines is what the rain brings."]
];
const mus: [string, string][] = [
  ['None', ''],
  ['Bossa nova', 'Complex harmony at low dynamics. Reduced chroma and short contrast: everything happens within a narrow band, and the sophistication is in the interval, not the volume.'],
  ['Samba de roda and batucada', 'Heavy syncopation. Proportion stops being regular: one colour dominates, the others come in off the beat, in small, recurring areas.'],
  ['Choro', 'Virtuosity within a fixed form. Irregular proportion, but always returning to the same point of support.'],
  ['Berlin techno', 'Repetition over a rigid grid. Extreme value contrast, almost no hue event, regular proportion — everything lives in the dark and in the pulse.'],
  ['Ambient and drone', 'No attack and no edge. Minimal chroma and lightness differences that barely resolve: the palette reads as a field, not a set.'],
  ['Punk', 'Black, white and one colour shouting. Maximum contrast, no transition, no supporting colour.'],
  ['Modal jazz', 'Few chords, much space. Wide intervals between hues and a proportion that breathes.'],
  ['Gospel and soul', 'High light and warmth. A large bright area with full colours over it — the palette is a choir, not a solo.'],
  ['Dub and reggae', 'Enormous bass and echo. The dark gains area, the rest comes in late and in pieces separated by silence.'],
  ['Fado', 'Minor mode, no ornament. Low chroma on dark, and colour appears as a single voice.'],
  ['Afrobeats', 'Layers of percussion that do not coincide. Several colours in medium areas, none fully subordinate.'],
  ['Classical romanticism', 'Long crescendo and resolution. Near-regular proportion, with a dominant that only asserts itself at the end.'],
  ["Flamenco", "Twelve-beat compás and a dry attack. High contrast and irregular proportion: one colour comes in like a handclap, off the expected place, and the silence between entries is part of the palette."],
  ["Tango", "Minor mode, cut and pause. Contained chroma, clear value contrast and one colour that appears like the bandoneon: alone, in the middle, and then withdraws."],
  ["Hip-hop and boom bap", "Short loop and a present bass. Proportion broken into repeating blocks, one dark dominant and the other colours as samples: recognisable pieces, cut out."],
  ["Indian raga", "Continuous drone and microtonal ornament. One base colour that never leaves, and the others as very close variations of it; almost no contrast, much nuance."],
  ["Gamelan", "Interlocking metals in cycles that fit into one another. Several colours in medium area, no soloist, all needed for the pattern to close."],
  ["Taiko", "Large drum and silence. Low chroma, maximum value contrast: the dark dominates and the light enters as a strike."],
  ["Highlife and soukous", "Bright guitars in cheerful layers. High chroma and high light, many colours in similar areas, no long shadow."],
  ["Cumbia", "A two-beat measure that sways. Full colours in near-regular proportion, with a slight tilt so the set never stands still."],
  ["Forró", "Accordion, zabumba and triangle: three voices of different weights. One large colour, one medium and one small that keeps time."],
  ["Minimalism — Reich, Glass", "Repetition with slow phase shift. Regular proportion and contained chroma; change happens by phasing, one colour gaining area almost unnoticed."],
  ["Gregorian chant", "A single line, without pulse, in stone. Almost no chroma and a narrow lightness band: the palette is one material with variations of light."],
  ["Delta blues", "Voice and guitar, twelve bars. Low chroma, one dark dominant and a warm colour that answers like the slide on the string."],
  ["K-pop", "Dense production and abrupt section changes. Maximum chroma, high light and a proportion that swaps dominant midway: the palette has two choruses."],
  ["Andean music", "Siku, charango and bombo. Wool colours at different heights, one low colour that holds and clear melodies above."]
];
const cvd = ['None — trichromatic vision', 'Deuteranopia — the most common', 'Protanopia', 'Tritanopia', 'Achromatopsia — no colour'];
const cls: Record<string, [string, string]> = {
  'serif-old': ['Humanist serif', 'The oldest, heirs of the angled pen. Oblique axis, moderate contrast, generous apertures. They read well in long text and bring warmth without seeming nostalgic.'],
  'serif-trans': ['Transitional serif', 'The step between pen and compass. More vertical axis, medium contrast, regulated forms. The most neutral class on the serif side and the safest for continuous text.'],
  'serif-mod': ['Modern serif', 'The Didones. Vertical axis, extreme contrast, thin straight serifs. They shine at large sizes and fall apart at small ones.'],
  'serif-slab': ['Slab serif', 'Rectangular serifs of the same weight as the stem. Almost no contrast, mechanical presence. They withstand poor printing and screen conditions.'],
  'sans-grot': ['Grotesque sans', 'The first sans serifs of the nineteenth century. Horizontal terminals, closed apertures, a rough personality. Good in headlines and at medium sizes.'],
  'sans-neo': ['Neo-grotesque sans', 'The modernist reform of the grotesque: uniform, quiet, almost without mannerism. The default class for interfaces.'],
  'sans-geo': ['Geometric sans', 'Built from circle and line. Minimal contrast, clarity in headlines, fatigue in long text because of repeated forms.'],
  'sans-hum': ['Humanist sans', 'A serif without the serifs: calligraphic axis, varied proportions, wide apertures. The best sans class for running text.'],
  'mono': ['Monospaced', 'Every letter the same width. Born of the typewriter and the terminal; today it carries technical reading, data, code and captions.'],
  'display': ['Display', 'Drawn for large sizes and small areas. Tight spacing, strong forms, no pretence of serving a paragraph.'],
};
export const MOODS_EN: Record<string, string> = { 'cerimônia': 'ceremony', 'repouso': 'rest', 'editorial': 'editorial', 'elegante': 'elegant', 'melancolia': 'melancholy', 'mistério': 'mystery', 'intimidade': 'intimacy', 'cuidado': 'care', 'calor': 'warmth', 'abundância': 'abundance', 'confiança': 'trust', 'rigor': 'rigour', 'institucional': 'institutional', 'técnico': 'technical', 'autoridade': 'authority', 'desejo': 'desire', 'energia': 'energy', 'aspiração': 'aspiration', 'informal': 'informal', 'alegria': 'joy', 'otimismo': 'optimism', 'urgência': 'urgency' };
const uses = ['None — no preference', 'Editorial and long text', 'Interface and digital product', 'Poster, cover and large headline', 'Presentation and slides', 'Document and report', 'Institutional website'];
const strats = ['None — just respect the filters', 'Structural contrast', 'Superfamily', 'A single family', 'Metric compatibility', 'Maximum opposition'];
const widths = ['None', 'Condensed', 'Normal', 'Wide'];
const contrs = ['None', 'Low — mechanical', 'Medium', 'High — Didone'];
const banks: [string, string, string][] = [
  ['Google Fonts', 'The largest open library, with a delivery API and direct download. Mostly SIL OFL and Apache licences.', 'woff2 via the API, ttf on download'],
  ['Fontshare', 'The Indian Type Foundry\'s library of contemporary families, free for commercial use.', 'woff2 and woff via the API, otf and ttf on download'],
  ['Fontsource', 'A mirror of the Google families packaged for npm and CDN, useful for self-hosting.', 'woff2 and woff per weight file'],
  ['Bunny Fonts', 'A tracking-free mirror of Google with the same URL syntax.', 'woff2'],
  ['Velvetyne', 'A French libre foundry with experimental designs and open licences.', 'otf, ttf and woff2'],
  ['The League of Moveable Type', 'A veteran open-font project: few families, well cared for.', 'otf, ttf and woff'],
  ['Uncut', 'A curated set of free contemporary families from several foundries.', 'varies by family'],
  ['Open Foundry', 'A curated set with a technical sheet and essay on each open family.', 'otf and woff'],
];
const roles = ['Label', 'Headline', 'Subheading', 'Paragraph', 'Emphasis', 'Quotation', 'Reference', 'Button'];
const cases = ['None — as written', 'Uppercase', 'Lowercase', 'Title case'];
export const SAMPLE_TXT_EN = `### Chromatic instrument
# Colour is born at the boundary between light and darkness
## Goethe refused the purely physical explanation and put the eye at the centre of the problem
What we see depends on the object, the lighting and the one who looks. From that refusal comes a circle of six hues, with one side that advances and another that recedes, and an intensification that brings the two extremes to meet in purple.
! The same logic holds for choosing a typeface: form is not neutral.
> In green, eye and soul rest. One does not wish to go further, and cannot.
The choice between two families is rarely a matter of taste. It is one of structure: x-height, stroke contrast, width and rhythm decide whether the paragraph looks even or patchy.
[See the full palette]
-- Zur Farbenlehre, 1810. Free translation.`;
const pieces = ['None — not set', 'Website or page', 'App or digital product', 'Visual identity', 'Poster or cover', 'Presentation or slides', 'Report or document', 'Book, e-book or magazine', 'Newsletter or e-mail', 'Packaging or label', 'Data dashboard', 'Social media piece', 'Signage or environment'];
const sups = ['None — not set', 'Screen', 'Print', 'Screen and print', 'Environment and large format'];
const angles: [string, string][] = [
  ['The direct reading', 'Stays within what the field already recognises and spends the difference on precision, not volume. It is the proposal that does not need defending in a meeting.'],
  ['The contrasting reading', 'Goes against the convention on purpose: the aim is to be perceived as different before being understood. Costs more to sustain and pays more when sustained.'],
  ['The lateral reading', 'Comes in by a route nobody asked for: it changes the axis of the problem, whether through cultural reference, dynamics or the quantity of colour. It is the one that usually opens the conversation.'],
];
/* palavras do léxico que apontam para nomes de tabelas — traduzidas junto com as tabelas */
const lexFrag: Record<string, string> = { 'Autoridade': 'Authority', 'Confiança': 'Trust', 'Alegria': 'Joy', 'Energia': 'Energy', 'Cerimônia': 'Ceremony', 'Intimidade': 'Intimacy', 'Repouso': 'Rest', 'Cuidado': 'Care', 'Abundância': 'Abundance', 'Melancolia': 'Melancholy', 'Mistério': 'Mystery', 'Rigor': 'Rigour', 'Desejo': 'Desire',
  'Luxo': 'Luxury', 'Clima': 'Climate', 'Bioeconomia': 'Bioeconomy', 'Tecnologia': 'Technology', 'Saúde': 'Health', 'Educação': 'Education', 'Turismo': 'Tourism', 'Alimentos': 'Food', 'Moda': 'Fashion', 'Arte': 'Art', 'Finanças': 'Finance', 'Setor público': 'Public sector', 'Varejo': 'Retail', 'Bem-estar': 'Wellbeing',
  'Amazônia': 'Amazon', 'Aotearoa': 'Aotearoa', 'Japão': 'Japan', 'México': 'Mexico', 'Índia': 'India', 'África': 'Africa', 'Andes': 'Andes', 'Mediterrâneo': 'Mediterranean', 'Nórdico': 'Nordic', 'Bauhaus': 'Bauhaus',
  'Punk': 'Punk', 'Ambient': 'Ambient', 'Afrobeats': 'Afrobeats', 'Fado': 'Fado', 'Techno': 'techno', 'Samba': 'Samba', 'Bossa': 'Bossa' };
/* palavras em inglês que o léxico passa a reconhecer — sempre, nos dois idiomas */
export const LEX_EN: string[][] = [
  ['serious', 'sober', 'formal', 'institutional', 'corporate', 'bank', 'government'],
  ['trust', 'reliable', 'safe', 'solid', 'stable'],
  ['cheerful', 'joyful', 'light', 'fun', 'optimistic', 'colourful', 'colorful', 'party'],
  ['urgent', 'urgency', 'promotion', 'sale', 'now', 'fast', 'action'],
  ['luxury', 'sophisticated', 'premium', 'exclusive', 'elegant', 'fine jewellery', 'refined'],
  ['warm', 'warmth', 'welcoming', 'affectionate', 'human', 'close', 'tender'],
  ['calm', 'serene', 'quiet', 'tranquil', 'rest', 'pause', 'silence'],
  ['nature', 'forest', 'regeneration', 'regenerative', 'climate', 'sustainable', 'environmental'],
  ['coffee', 'cocoa', 'agriculture', 'farm', 'cooperative', 'agri'],
  ['amazon', 'indigenous', 'standing forest', 'riverside', 'kayapo', 'urucum', 'jenipapo'],
  ['maori', 'māori', 'aotearoa', 'new zealand', 'iwi', 'tangata'],
  ['japan', 'japanese', 'zen', 'wabi', 'japanese minimal', 'kyoto', 'tokyo'],
  ['mexico', 'barragan', 'latin'],
  ['india', 'indian', 'sari', 'holi'],
  ['africa', 'african', 'kente', 'adire', 'afrobeat'],
  ['andes', 'andean', 'peru', 'bolivia', 'quechua'],
  ['mediterranean', 'greece', 'ibiza', 'whitewash'],
  ['nordic', 'scandinavian', 'sweden', 'denmark', 'norway'],
  ['bauhaus', 'modernist', 'swiss', 'grid'],
  ['technology', 'software', 'saas', 'startup', 'platform', 'digital', 'api'],
  ['health', 'clinic', 'hospital', 'patient', 'doctor', 'medical'],
  ['education', 'school', 'course', 'learn', 'teaching', 'university'],
  ['travel', 'tourism', 'itinerary', 'expedition', 'retreat', 'lodging', 'hospitality'],
  ['food', 'restaurant', 'drink', 'gastronomy', 'chef', 'menu'],
  ['fashion', 'clothing', 'collection', 'runway', 'apparel'],
  ['art', 'museum', 'gallery', 'exhibition', 'curation', 'editorial'],
  ['finance', 'investor', 'fund', 'capital', 'bank', 'credit'],
  ['ngo', 'social', 'community', 'impact', 'donation', 'volunteer', 'charity'],
  ['bold', 'radical', 'provocative', 'disruptive', 'loud', 'strong'],
  ['discreet', 'restrained', 'subtle', 'quiet', 'minimalist', 'clean'],
  ['maximal', 'exuberant', 'plentiful', 'abundant', 'festive', 'vibrant'],
  ['nocturnal', 'dark', 'night', 'black background'],
  ['movement', 'animation', 'video', 'motion'],
  ['shelf', 'supermarket', 'retail', 'packaging'],
  ['melancholy', 'longing', 'nostalgia', 'memory', 'mourning'],
  ['mystery', 'occult', 'ritual', 'spiritual', 'sacred', 'initiation'],
  ['technical', 'data', 'research', 'scientific', 'engineering'],
  ['brazil', 'brazilian', 'samba', 'carnival', 'tropical'],
  ['bossa', 'jazz', 'smooth', 'sonic sophistication'],
  ['young', 'youth', 'teen', 'gen z', 'tiktok'],
  ['children', 'child', 'kids', 'toy', 'playful'],
  ['elderly', 'longevity', 'senior', 'ageing'],
  ["nostalgia", "tenderness", "childhood", "grandmother", "fond memory"],
  ["courage", "bold", "assertive", "determined", "daring"],
  ["reverence", "sacred", "temple", "liturgy", "devotion"],
  ["wonder", "awe", "astonishment", "cosmos", "universe", "stars"],
  ["contemplation", "contemplative", "meditation", "retreat", "stillness"],
  ["hope", "new beginning", "rebirth", "spring"],
  ["farewell", "funeral", "memorial", "loss", "tribute"],
  ["sensual", "erotic", "skin", "lingerie", "perfume", "seduction"],
  ["freedom", "vastness", "horizon", "journey", "open road", "open sea"],
  ["humour", "humor", "ironic", "joke", "satire", "sarcasm"],
  ["roots", "belonging", "earth", "ancestral", "territory"],
  ["ecstasy", "vertigo", "rave", "club", "night"],
  ["wisdom", "maturity", "tradition", "centenary", "heritage"],
  ["relief", "lightness", "breathe", "wellbeing", "spa"],
  ["morocco", "moroccan", "marrakech", "zellige", "riad"],
  ["korea", "korean", "seoul", "hanbok"],
  ["china", "chinese", "jade", "lunar new year", "beijing"],
  ["mali", "bogolan", "sahel", "bamako"],
  ["portugal", "portuguese", "azulejo", "lisbon", "porto"],
  ["egypt", "egyptian", "pharaoh", "nile"],
  ["persia", "persian", "iran", "miniature", "persian rug"],
  ["guatemala", "maya", "mayan", "huipil", "backstrap"],
  ["java", "indonesia", "batik", "bali"],
  ["scotland", "scottish", "tartan", "plaid"],
  ["turkey", "turkish", "ottoman", "istanbul", "iznik"],
  ["australia", "aboriginal", "outback", "red desert"],
  ["sertão", "cerrado", "caatinga", "northeast brazil"],
  ["flamenco", "andalusia", "seville"],
  ["tango", "buenos aires", "milonga"],
  ["hip-hop", "hip hop", "rap", "boom bap", "streetwear"],
  ["raga", "sitar", "tabla", "indian music"],
  ["taiko", "japanese drum", "dojo"],
  ["cumbia", "colombia", "caribbean"],
  ["minimalism", "minimalist", "repetition", "glass", "reich"],
  ["gregorian", "monastery", "monastic", "sacred choir"],
  ["blues", "delta", "mississippi"],
  ["k-pop", "kpop", "idol"],
  ["andean", "charango", "siku", "quena"],
  ["highlife", "soukous", "congo", "ghana"]
];
const views_axes = ['Colour', 'Type', 'Pairings', 'Applications'];

interface AxisEn { tese: string; corpo: string[]; obs?: string[]; fontes?: string[] }
interface EdEn { id: string; per: string; tese: string; cor: AxisEn; tipo: AxisEn; comb: AxisEn; apl: AxisEn }
const trend: EdEn[] = [
  { id: 'Q3 2026', per: 'July to September 2026',
    tese: 'The cycle splits in two. On one side, colour becomes an event again after a year of structural white; on the other, type and identity refuse the neutrality that automated production made cheap.',
    cor: { tese: 'Cobalt blue as anchor, earthy warmth as counterweight',
      obs: ['WGSN and Coloro Colour of the Year 2027, Coloro code 125-28-38', 'S/S 27 key colour, Coloro code 018-57-34', 'S/S 27 key colour, Coloro code 151-73-22', 'S/S 27 key colour, Coloro code 050-61-19', 'S/S 27 key colour, Coloro code 014-60-13'],
      corpo: ['WGSN and Coloro named Luminous Blue Colour of the Year 2027 and described the theme governing the choice of the five spring/summer 2027 key colours: interconnection between polarities — light and dark, nature and technology, ancient and contemporary, rationality and spirituality.',
        'The first three key colours are declaredly upbeat, meant to sustain people under pressure; the last two, Meadowland Green and Clay, come from the search for purpose and for a bond with community and nature. It is the same tension Goethe describes between the active and passive sides of the circle, with purple absent and blue taking the role of gravity.',
        'For the colour instrument the practical reading is this: a cold, high-chroma blue as primary, with orange and clay coming in as a characteristic counterpart in small area — not as a complementary in equal area, which is the predictable mistake with that combination.'],
      fontes: ['WGSN and Coloro, press release of 29 April 2025', 'Coloro, key colours page', 'WWD, coverage of 29 April 2025'] },
    tipo: { tese: 'The variable font became infrastructure, and neutrality became a fault',
      corpo: ['The variable font standard, published by the W3C in 2017, stopped being a differentiator and became an expectation: browsers, operating systems and design tools handle it without friction, and a whole family arrives in a single file covering weight, optical size, width and experimental axes.',
        'The aesthetic movement runs the other way from the file economy. Clean grotesques became so ubiquitous in product that they came to read as an absence of choice, and the more interesting work migrated to what is softer, warmer, more expressive or simply odder. The saturation of automatically generated content turned the hand-drawn stroke into a sign of authorship.',
        'Money has also returned to type: after a decade of budget discipline resting on open libraries alone, studios went back to commissioning and licensing their own designs. The free libraries remain excellent — the difference is that they stopped being the only acceptable route.'],
      fontes: ['Font Trends 2026, market survey and foundry releases', 'Typography Trends 2026, variable fonts and kinetic type', 'Monotype, annual Type Trends report'] },
    comb: { tese: 'A flexible palette in place of a fixed one',
      corpo: ['The recommendation repeated across identity reports is to abandon the frozen palette in favour of a chromatic theme that shifts by context and platform: recognisable by atmosphere, not by an exact set of values.',
        'That changes what a colour system needs to deliver. Five hex values are not enough: you need a rule of displacement — how far the hue may turn, how high the chroma may rise, which band of lightness still belongs to the system. It is exactly what a circle with preserved geometry solves and a list of swatches does not.',
        'The counterpart is the risk of dissolution. Without an anchor of value — a dark and a light that do not move — a flexible identity becomes an indistinguishable one.'],
      fontes: ['The Branding Journal, identity and design trends 2026', 'It\'s Nice That, graphic trends 2026'] },
    apl: { tese: 'Motion before form, texture before finish',
      corpo: ['Identity conceived first in motion stopped being a motion-studio speciality and became a delivery requirement, because the screen became the first point of contact rather than the last.',
        'With it comes a preference for surface: translucent, waxy, glassy, with visible grain and imperfection. The current reading is that this works as a signature of human authorship in an environment saturated with automatic production.',
        'For anyone working with colour the consequence is technical: a palette tested only on flat surfaces breaks when it enters transparency and overlap. Test each pair in layers before closing.'],
      fontes: ['Three Rooms, eight identity trends for 2026', 'It\'s Nice That, graphic trends 2026'] } },
  { id: 'Q2 2026', per: 'April to June 2026',
    tese: 'The quarter\'s behaviour report shifts the axis from novelty to stability, and the visual consequence is a preference for legible continuity over annual rupture.',
    cor: { tese: 'A stability premium: colour that does not need replacing every year',
      obs: ['approximation of the continuity blue described in the reports', 'approximation', 'approximation', 'approximation'],
      corpo: ['Accenture\'s Life Trends report for 2026 organises the year into five movements, and the first is the stability premium: predictability of price and quality becomes a comfort in an unstable context, and domestic rituals become an anchor.',
        'The chromatic translation appearing in identity material is that of dynamic legacy — preserving what is already recognised and modernising from within, rather than starting over. In practice this favours analogous and monochromatic schemes over complementary ones, and medium chroma over high.'],
      fontes: ['Accenture Life Trends 2026'] },
    tipo: { tese: 'Type as an asset of continuity',
      corpo: ['When the strategy is continuity, type stops being where novelty is sought and becomes where durability is sought: transitional and humanist classes, compatible x-heights, families with a weight range wide enough to carry hierarchy without changing design.'],
      fontes: ['Accenture Life Trends 2026'] },
    comb: { tese: 'Dynamic legacy rather than a fresh start',
      corpo: ['The quarter\'s strategic recommendation is to preserve accumulated visual heritage and evolve from within. For a colour system that means a small, deliberate deviation from what already exists — the same discipline the consultancy networks apply to multi-market programmes.'],
      fontes: ['Accenture Life Trends 2026'] },
    apl: { tese: 'Ritual as a point of contact',
      corpo: ['If behaviour anchors itself in routine, the application that matters most stops being the campaign and becomes the recurring piece: the packaging that reappears, the screen that opens every day, the document that arrives every month. These are surfaces that forgive poor contrast less, because they are seen many times.'],
      fontes: ['Accenture Life Trends 2026'] } },
  { id: 'Q1 2026', per: 'January to March 2026',
    tese: 'For the first time in twenty-seven years the colour institute chooses a white. The consequence is not an absence of colour: it is that white comes to be treated as a material with a role, not as a background.',
    cor: { tese: 'White as a structural colour',
      obs: ['Pantone 11-4201, Colour of the Year 2026 — sRGB approximation', 'WGSN and Coloro Colour of the Year 2026 — approximation', 'approximation from the published light-and-shadow palettes', 'approximation from the published pastel palettes'],
      corpo: ['On 4 December 2025 the institute announced Pantone 11-4201 Cloud Dancer as Colour of the Year 2026, described as an airy white that acts as a symbol of calming influence in a society rediscovering the value of quiet reflection. It is the first time the choice has fallen on a white.',
        'The published argument is one of structure, not fashion: a white that serves as scaffolding for the spectrum and lets the other colours appear. Seven palettes were released with it, among them dusty pastels and light and shadow.',
        'In parallel, WGSN and Coloro had already named Transformative Teal their Colour of the Year 2026, for representing change and stability at once. The two choices converge on the same diagnosis and diverge in the answer: one withdraws, the other mediates.',
        'Goethe\'s reading here is direct. He refuses to treat white as absence: light and darkness are the two poles without which no colour exists. A white Colour of the Year is the industry arriving, by another route, at the position of 1810.'],
      fontes: ['Pantone, Colour of the Year 2026', 'Pantone, the seven Cloud Dancer palettes', 'NPR, coverage of 4 December 2025', 'Coloro, key colours and history'] },
    tipo: { tese: 'Revision rather than invention',
      corpo: ['The annual type-trend report from the foundry that publishes most on the subject treated the cycle under the title of revision — rereading existing repertoire rather than searching for unprecedented form. In practice: careful revivals, serif text faces and the correction of designs that had circulated too long without adjustment.'],
      fontes: ['Monotype, Type Trends'] },
    comb: { tese: 'White in the dominant area, colour in cut-outs',
      corpo: ['A palette anchored in structural white demands inverting the usual proportion: the light surface goes from sixty to eighty per cent of the area, and hue comes in as an event. It is the method studios of restraint already practise, now with the calendar\'s backing.',
        'The declared risk is emptiness. Dominant white without a well-chosen dark and without an accent of measured contrast produces what the sector called an identity without identity.'],
      fontes: ['Pantone, guide to applying Cloud Dancer'] },
    apl: { tese: 'Tactile surface as compensation',
      corpo: ['When colour recedes, material advances: the materials released with the choice of the year emphasise padded texture, wool, fur and rounded volume. On a flat medium the equivalent is grain, visible paper and soft shadow — the compensation of those who took hue out of the equation.'],
      fontes: ['Pantone, guide to applying Cloud Dancer'] } },
];

export function localizeData(): void {
  ANCHORS[0].nome = 'Purple'; ANCHORS[1].nome = 'Red-yellow'; ANCHORS[2].nome = 'Yellow'; ANCHORS[3].nome = 'Green'; ANCHORS[4].nome = 'Blue'; ANCHORS[5].nome = 'Red-blue';
  EMO.forEach((e, i) => { e.n = emo[i][0]; e.g = emo[i][1] });
  MKT.forEach((m, i) => { m.n = mkt[i][0]; m.c = mkt[i][1]; m.d = mkt[i][2] });
  SCH.forEach((s, i) => { s.n = sch[i][0]; s.d = sch[i][1] });
  LENS.forEach((l, i) => { l.n = lens[i][0]; l.m = lens[i][1] });
  CULT.forEach((c, i) => { c.n = cult[i][0]; c.m = cult[i][1] });
  MUS.forEach((m, i) => { m.n = mus[i][0]; m.m = mus[i][1] });
  CVDLIST.forEach((c, i) => { c.n = cvd[i] });
  (Object.keys(cls) as (keyof typeof CLS)[]).forEach(k => { CLS[k].n = cls[k][0]; CLS[k].d = cls[k][1] });
  USES.forEach((u, i) => { u.n = uses[i] }); STRATS.forEach((s, i) => { s.n = strats[i] });
  WIDTHS.forEach((w, i) => { w.n = widths[i] }); CONTRS.forEach((c, i) => { c.n = contrs[i] });
  BANKS.forEach((b, i) => { b[0] = banks[i][0]; b[1] = banks[i][1]; b[2] = banks[i][2] });
  ROLES.forEach((r, i) => { r.n = roles[i] }); CASES.forEach((c, i) => { c.n = cases[i] });
  PIECES.forEach((p, i) => { p.n = pieces[i] }); SUPS.forEach((s, i) => { s.n = sups[i] });
  ANGLES.forEach((a, i) => { a.n = angles[i][0]; a.why = angles[i][1] });
  LEX.forEach(e => { (['emo', 'mkt', 'cult', 'mus'] as const).forEach(k => { const v = e[k]; if (v && lexFrag[v]) e[k] = lexFrag[v] }) });
  AXES.forEach((a, i) => { a.n = views_axes[i] });
  TREND.forEach((e, i) => { const t = trend[i]; if (!t) return; e.id = t.id; e.per = t.per; e.tese = t.tese;
    (['cor', 'tipo', 'comb', 'apl'] as const).forEach(k => { const ax = e[k], ex = t[k]; ax.tese = ex.tese; ax.corpo = ex.corpo;
      if (ax.pal && ex.obs) ax.pal.forEach((p, j) => { p.obs = ex.obs![j] || p.obs });
      if (ex.fontes) ax.fontes.forEach((f, j) => { f.n = ex.fontes![j] || f.n }) }) });
  // humores das famílias: só a exibição muda; a pontuação usa a chave da intenção (independente de idioma)
}
