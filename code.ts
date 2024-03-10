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

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {height:280});

// check textnodes
const nodes = figma.currentPage.selection.filter(item=>item.type === "TEXT")

if (nodes.length === 0) {
  figma.ui.close()
  figma.closePlugin()
  figma.notify("Please select some textnodes and define your range");  
} 

figma.ui.onmessage = async (range) => {

  if (range.length !== 3) {
    figma.closePlugin()
  }

  await figma.loadFontAsync({ family: "Inter", style: "Regular" })

  // walk through all textnodes and do some magic
  const list = $Number.getChunks(nodes.length, range[0], range[1])

  if (range[2] === 'asc') {
    list.sort( (a,b) => a - b);
  } else if (range[2] === 'desc') {
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

  figma.viewport.scrollAndZoomIntoView(nodes);
}

