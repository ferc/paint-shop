const getMattes = (customers, mattes = []) => {
  const filteredCustomers = customers
    // filter customers who already has a paint type that they like
    .filter(colors =>
      !colors.some(color =>
        color.type === 'M' && mattes.includes(color.number)
      )
    )
    // filter colors already picked (gross type of the mattes already picked)
    .map(colors =>
      colors.filter(color => !mattes.includes(color.number))
    );

  const noMatch = filteredCustomers.some(colors => colors.length === 0);

  if (noMatch) {
    throw new Error('No solution exists');
  }

  const matteNumbers = filteredCustomers
    .filter(colors => colors.length === 1 && colors[0].type === 'M')
    .map(colors => colors[0].number);

  if (!matteNumbers.length) {
    return mattes;
  }

  const uniqueMatteColors = [...new Set(matteNumbers.concat(mattes))];

  return getMattes(filteredCustomers, uniqueMatteColors);
};

const normalizeInput = input => {
  let [colorsAmount, ...customers] = input.split('\n');

  customers = customers.map(customer => {
    const colors = customer.match(/\d+ (M|G)/g);

    return colors.map(color => {
      const [number, type] = color.split(' ');

      return {
        number: Number(number),
        type
      };
    });
  });

  return {
    colorsAmount: Number(colorsAmount),
    customers
  };
};

const processColors = (input) => {
  const { colorsAmount, customers } = normalizeInput(input);
  const mattes = getMattes(customers);

  const output = Array(colorsAmount).fill(null).map((type, index) => {
    return mattes.includes(index + 1) ? 'M' : 'G';
  });

  return output.join(' ');
};

let input = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;

  while ((chunk = process.stdin.read()) !== null) {
    input += chunk;
  }
});

process.stdin.on('end', () => {
  try {
    const output = processColors(input);

    process.stdout.write(output);
  } catch(e) {
    process.stderr.write('No solution exists');
    process.exit(1);
  }
});
