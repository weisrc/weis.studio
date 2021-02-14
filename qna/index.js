const TYPE_SPEED = 30;
const cli = document.querySelector("#cli");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cliPrint(text, className = "cli-line", ms = TYPE_SPEED) {
  const line = cli.appendChild(document.createElement("pre"));
  line.className = className;
  line.classList.add("active");
  for (let char of text) {
    line.textContent += char;
    await sleep(ms);
  }
  line.classList.remove("active");
}

function cliBreakLn() {
  cli.appendChild(document.createElement("br"));
}

async function cliPrintLn(text, className, ms) {
  await cliPrint(text, className, ms);
  cliBreakLn();
}

function cliYesNo(yesMsg = "Sure!", noMsg = "No thanks") {
  const container = cli.appendChild(document.createElement("div"));
  container.className = "cli-margin";
  const yes = container.appendChild(document.createElement("button"));
  const no = container.appendChild(document.createElement("button"));
  yes.className = "cli-btn cli-btn-yes";
  no.className = "cli-btn cli-btn-no";
  yes.innerText = yesMsg;
  no.innerText = noMsg;
  function disable() {
    yes.disabled = true;
    no.disabled = true;
  }
  return new Promise((resolve) => {
    yes.addEventListener("click", () => {
      disable();
      resolve(true);
    });
    no.addEventListener("click", () => {
      disable();
      resolve(false);
    });
  });
}

function cliInput(placeholder = "Type here!") {
  const input = cli.appendChild(document.createElement("input"));
  input.className = "cli-box";
  input.placeholder = placeholder;
  return new Promise((resolve) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        input.disabled = true;
        resolve(input.value);
      }
    });
  });
}

async function mainSequence() {
  await cliPrintLn("Hello there!");
  await cliPrintLn("My name is Wei...");

  await cliPrintLn("Who is Wei?", "cli-header");
  await cliPrintLn("I am a Full Stack developer who does fancy things...");
  await cliPrintLn("like the website you are currently reading me from!");

  await cliPrintLn("What can you do?", "cli-header");
  await cliPrint("I can do many cool things both in the");
  await cliPrint("frontend", "cli-line em");
  await cliPrint("and the");
  await cliPrint("backend", "cli-line em");
  await cliPrintLn("using many technologies.");

  await cliPrintLn("Node.js, HTML, CSS, Javascript?", "cli-header");
  await cliPrintLn("I mean a lot of technologies...");
  await cliPrintLn("Do you want me to list them all?");
  if (await cliYesNo()) {
    await cliPrintLn("Here I go!");
    await cliPrintLn("Node.js, React.js, React Native, Svelte, Angular, Python, Javascript, HTML, CSS, Go, Rust, Java, Spring, C#, .NET, Linux, Flask, Express, MongoDB, SQL and C++");
    await cliPrintLn("This is all I can recall...");
  }

  await cliPrintLn("Do you have any work experience?", "cli-header");
  await cliPrintLn("Yes, I am working for a startup VPN company named AstroVPN for almost half a year. I am the core developer for its API and I am having a lot of fun working there!");

  await cliPrintLn("What is your education?", "cli-header");
  await cliPrintLn("Hmmm...");
  await cliPrintLn("I am still in college... Hahaha! I am a self-taught programmer...");
  await cliPrintLn("However, I've been learning new technologies one after the other for almost 4 years.");
  await cliPrintLn("Are you still interested?");
  if (!(await cliYesNo("Yes!", "Nope. Good bye!"))) {
    await cliPrintLn("Thanks for visiting my website. I hope I can see you soon again!");
    return;
  }
  await cliPrintLn("Thank you so much!");
  await cliPrintLn("So how can I reach you?", "cli-header");
  await cliPrintLn("You can simply reach me with the little message icon on the bottom right and I will contact you as soon as I can.");
  await cliPrintLn("Can I get answers now?", "cli-header");
  await cliPrintLn("You can simply type your question in the following field and the Q&A model will try its best to answer the question. It might take time to load...");
  const context = await (await fetch("/qna/context.txt")).text();
  const model = await qna.load();
  let qnaAgain = true;
  while (qnaAgain) {
    try {
      const answers = await model.findAnswers(await cliInput("Your question here..."), context);
      console.log(answers);
      if (!answers || !answers[0]) throw 0;
      await cliPrintLn(answers[0].text, "cli-box cli-success");
    } catch {
      await cliPrintLn("Sorry, I don't know how to answer your question.", "cli-box cli-error");
    }
    await cliPrintLn("Do you have another question?");
    qnaAgain = await cliYesNo("Yes", "No");
  }
}

mainSequence();
