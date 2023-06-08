export const SHARE_QUERY_KEY = 's';

export const SNIPPETS = [
  {
    label: 'Hello World!',
    value: `"Hello" + " " + "World!"`,
  },

  {
    label: 'Arithmetic',
    value: `(10 + 2) * 30 + 5`,
  },

  {
    label: 'Conditionals',
    value: `if (true) {
  puts("Hello");
} else {
  puts("unreachable");
}

if (true || false) {
  puts("true || false");
} else {
  puts("unreachable");
}

if (true && false) {
  puts("unreachable");
} else {
  puts("true && false");
}`,
  },

  {
    label: 'For loop',
    value: `let sum = 0;
let i = 5;
for (i>0) {
    if (i == 4) {
        break;
    }
    sum += i;
    i -= 1;
}
sum // 5`,
  },

  {
    label: 'Variable bindings',
    value: `let x = 10;
let y = 15;

x += 1;
x + y;`,
  },

  {
    label: 'Array',
    value: `let arr = [1, "two", 3.0];

puts(arr[0]);
puts(arr[1]);
puts(arr[2]);`,
  },

  {
    label: 'Hash',
    value: `let hash = { "name": "cae", "age": 24 };
puts(hash["name"]);
puts(hash["age"]);`,
  },

  {
    label: 'Function',
    value: `let factorial = fn(n) {
  if (n == 0) {
    1
  } else {
    n * factorial(n - 1)
  }
};

puts(factorial(5)) // 120

let fib = fn(n) {
  if (n == 1 || n == 2) {
    1
  } else {
    fib(n - 1) + fib(n - 2)
  }
};

puts(fib(10)) // 55`,
  },

  {
    label: 'Closures',
    value: `fn closure(){
    let x= 1;
    fn(){
        x+=1;
        x
    }
}
let c = closure();
puts(c()); // 2
puts(c()); // 3
puts(c()); // 4`
  },
];
