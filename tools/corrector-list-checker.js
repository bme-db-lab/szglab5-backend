const inquirer = require('inquirer');

async function main() {
  const listPromptResult = await inquirer.prompt([
    {
      type: 'input',
      name: 'list1',
      message: 'List1',
    },
    {
      type: 'input',
      name: 'list2',
      message: 'List2'
    }
  ]);

  const list1 = JSON.parse(listPromptResult.list1);
  console.log(`List1 length: ${listPromptResult.list1}`);

  const list2 = JSON.parse(listPromptResult.list2);
  console.log(`List2 length: ${listPromptResult.list2}`);

  for (let i = 0; i < list1.length; i++) {
    let list1ElemMatch = false;
    for (let j = 0; j < list2.length; j++) {
      if (list1[i] === list2[j]) {
        list1ElemMatch = true;
        break;
      }
    }
    process.stdout.write(list1[i]);
    if (list1ElemMatch) {
      process.stdout.write(' +');
    } else {
      process.stdout.write(' -');
    }

    process.stdout.write('\n');
  }
}

main();
