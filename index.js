function nodeFactory(InputValue) {
  return {
    data: InputValue,
    left: null,
    right: null,
  };
}

function treeFactory(inputArray) {
  sortAndRemoveDuplicades(inputArray);
  let root = buildTree(inputArray);

  function sortAndRemoveDuplicades(array) {
    array.sort((a, b) => a - b);
    for (let i = 0; i < array.length; i++) {
      if (array[i] === array[i + 1]) {
        array.splice(i, 1);
        i--;
      }
    }
  }

  function buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;

    let mid = start + Math.floor((end - start) / 2);
    let root = nodeFactory(array[mid]);

    root.left = buildTree(array, start, mid - 1);
    root.right = buildTree(array, mid + 1, end);

    return root;
  }

  const prettyPrint = (node = root, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  const insert = (key, node = root) => {
    if (node === null) {
      return nodeFactory(key);
    }
    if (key === node.data) {
      console.log("value already at the tree");
      return node;
    }
    if (key < node.data) {
      node.left = insert(key, node.left);
    } else if (key > node.data) {
      node.right = insert(key, node.right);
    }
    return node;
  };

  const deleteItem = (key, node = root) => {
    if (node === null) {
      return node;
    }

    if (node.data > key) {
      node.left = deleteItem(key, node.left);
    } else if (node.data < key) {
      node.right = deleteItem(key, node.right);
    } else {
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }
      let succ = getSuccessor(node);
      node.data = succ.data;
      node.right = deleteItem(succ.data, node.right);
    }
    return node;
  };

  function getSuccessor(current) {
    current = current.right;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  const find = (value, node = root) => {
    if (node === null) {
      return node;
    }

    if (value > node.data) {
      return find(value, node.right);
    }
    if (value < node.data) {
      return find(value, node.left);
    } else {
      return node;
    }
  };

  const levelOrder = (callback) => {
    if (root === null) {
      return null;
    }
    if (!callback) {
      throw new Error("You need to provide a callback function");
    }
    const queue = [];
    queue.push(root);
    while (queue.length > 0) {
      callback(queue[0]);
      if (queue[0].left !== null) {
        queue.push(queue[0].left);
      }
      if (queue[0].right !== null) {
        queue.push(queue[0].right);
      }
      queue.shift();
    }
  };

  const inOrder = (callback, node = root) => {
    if (node === null) {
      return;
    }
    inOrder(callback, node.left);
    callback(node);
    inOrder(callback, node.right);
  };

  const postOrder = (callback, node = root) => {
    if (node === null) {
      return;
    }
    postOrder(callback, node.left);
    postOrder(callback, node.right);
    callback(node);
  };

  const preOrder = (callback, node = root) => {
    if (node === null) {
      return;
    }
    callback(node);
    preOrder(callback, node.left);
    preOrder(callback, node.right);
  };

  const height = (value) => {
    let node = find(value);
    let result = -1;
    findHeight(node, value);

    function findHeight(node, value) {
      if (node === null) {
        return -1;
      }
      let leftHeight = findHeight(node.left, value);
      let rightHeight = findHeight(node.right, value);
      let ans = Math.max(leftHeight, rightHeight) + 1;

      if (node.data === value) {
        result = ans;
      }

      return ans;
    }

    return result;
  };

  const depth = (value) => {
    let counter = 0;
    findDepth(value);

    function findDepth(value, node = root) {
      if (node === null) {
        return null;
      }
      if (node.data === value) {
        return;
      }
      if (value > node.data) {
        counter++;
        findDepth(value, node.right);
      } else if (value < node.data) {
        counter++;
        findDepth(value, node.left);
      }
    }

    return counter;
  };

  const isBalanced = () => {
    let leftSide = checkTree(root.left.data, root.left);
    let rightSide = checkTree(root.right.data, root.right);
    let difference = Math.abs(leftSide - rightSide);

    function checkTree(value, node) {
      if (node === null) {
        return -1;
      }
      let leftTree = checkTree(value, node.left);
      let rightTree = checkTree(value, node.right);
      let ans = Math.max(leftTree, rightTree) + 1;

      if (node.data === value) {
        return ans + 1;
      }

      return ans;
    }
    if (difference <= 1) {
      console.log("It's Balanced");
      return true;
    } else {
      console.log("It's Unbalanced");
      return false;
    }
  };

  const rebalance = () => {
    let newArray = [];
    inOrder(createArray);
    function createArray(input) {
      newArray.push(input.data);
    }
    sortAndRemoveDuplicades(newArray);
    root = buildTree(newArray);
  };

  return {
    prettyPrint,
    insert,
    deleteItem,
    find,
    levelOrder,
    inOrder,
    postOrder,
    preOrder,
    height,
    depth,
    isBalanced,
    rebalance,
  };
}

function randomArray() {
  let arr = [];
  let arrSize = 10;
  let maxNumber = 100;
  for (let i = 0; i < arrSize; i++) {
    arr.push(Math.floor(Math.random() * maxNumber));
  }
  return arr;
}

function printOut(value) {
  console.log(value.data);
}

let arr = randomArray();
let tree = treeFactory(arr);
tree.isBalanced();
// tree.levelOrder(printOut);
// tree.preOrder(printOut);
// tree.postOrder(printOut);
// tree.inOrder(printOut);
tree.insert(120);
tree.insert(190);
tree.insert(180);
tree.insert(199);
tree.insert(155);
tree.insert(144);
tree.insert(167);
tree.isBalanced();
tree.prettyPrint();
tree.rebalance();
tree.isBalanced();
tree.prettyPrint();
