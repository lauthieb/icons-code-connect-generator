figma.showUI(__html__)
figma.ui.resize(400, 600);

const ICONS_PREFIX = 'Svg';

function generateImportStatement(name: string) {
  return `import ${ICONS_PREFIX}${name} from "./${name}";`;
}

function generateFigmaConnectStatement(name: string, nodeId: string) {
  return `figma.connect(${ICONS_PREFIX}${name}, "<FIGMA_ICONS_BASE>?node-id=${nodeId.replace(':', '-')}", { example: () => <${ICONS_PREFIX}${name} />, imports: ["import { ${ICONS_PREFIX}${name} } from '@my-lib/react'"] });`;
}

function traverseAndGenerateCode(frame: FrameNode) {
  const iconComponents = frame.children.filter(node => node.type === 'COMPONENT');
  const imports: string[] = ['import figma from "@figma/code-connect";'];
  const connects: string[] = [];

  iconComponents.forEach((component: ComponentNode) => {
    const componentName = component.name.replace(/\s+/g, '');
    const nodeId = `${component.id}`;
    
    imports.push(generateImportStatement(componentName));
    connects.push(generateFigmaConnectStatement(componentName, nodeId));
  });

  const codeOutput = `${imports.join("\n")}\n\n${connects.join("\n")}`;
  
  figma.ui.postMessage(codeOutput);
}

function main() {
  const iconsFrame = figma.currentPage.findOne(node => node.id === '1:206' && node.type === 'FRAME');

  if (iconsFrame && iconsFrame.type === 'FRAME') {
    traverseAndGenerateCode(iconsFrame as FrameNode);
  } else {
    console.error('Frame "Icons" not found.');
    figma.closePlugin();
  }
}

main();