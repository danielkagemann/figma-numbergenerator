/**
 * Number object for the special handling
 */
const $Number = {
  getRandomInt(min: number, max: number) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  },
  getChunks: (amount: number, from: number, to: number) => {
      return Array(amount).fill(0).map(_ => $Number.getRandomInt(from, to));
  }
};

type NumberParameter = {
  from:number,
  to:number,
  options: string
}

/**
 * helper routine to get all textnodes
 * @returns 
 */
const getNodes = (): SceneNode[] => {
  return figma.currentPage.selection.filter(item=>item.type === "TEXT");
};

/**
 * walk through textnodes and calculate the amount of numbers
 * @param nodes 
 */
const getRequiredNumbers = (nodes: SceneNode[]): number => {
  let amount = 0;
  nodes.forEach (node => {
    let count = 0;
    (node as TextNode).characters.replace(/\d+/g, match => {
      count += 1
      return match
    });
  
    // at least we have one for the whole textnode 
    if (count === 0) {
      count += 1
    }
    amount += count
  });

  return amount
};

/**
 * do the main job
 * @param data
 * @param shouldClose
 */
const processing = async ({from, to, options}: NumberParameter, shouldClose = false) => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" })

  const nodes = getNodes()

  // walk through all textnodes and do some magic
  const list = $Number.getChunks(nodes.length, from, to)

  if (options === 'asc') {
    list.sort( (a,b) => a - b);
  } else if (options === 'desc') {
    list.sort( (a,b) => b - a);
  } else {
    list
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
  }

  nodes.forEach((node: SceneNode, index: number) => {
    (node as TextNode).characters = list[index].toString()
  });

  if (shouldClose) {
    figma.closePlugin();
  }
}

/**
 * listener for parameter input
 * handle the suggestions for parameters
 */
figma.parameters.on(
  'input',
  ({ key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'options':
        result.setSuggestions(['asc', 'desc', 'random'].filter(s => s.includes(query)))
        break
      default:
        return
    }
  }
)

/**
 * listener for ui call
 * @param range
 */
figma.ui.onmessage = async (range) => {

  if (range.length !== 3) {
    figma.closePlugin()
  }
  processing({from: range[0], to: range[1], options: range[2]})
}

/**
 * listener for running
 */
figma.on('run', ({ parameters }: RunEvent) => {
  // check textnodes
  const nodes = figma.currentPage.selection.filter(item=>item.type === "TEXT")
  if (nodes.length === 0) {
    figma.closePlugin()
    figma.notify("Please select some textnodes and define your range");  
    return
  }

  // start the UI
  if (parameters === undefined) {
      figma.showUI(__html__, { themeColors: true, height:260 });
  } else {
    processing({
      from: Number(parameters.from), 
      to: Number(parameters.to), 
      options: parameters.options
    }, true);
  }
})



