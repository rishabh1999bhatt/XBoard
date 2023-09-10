const magazines = [
  "https://flipboard.com/@thenewsdesk/top-stories-in-news-t9s06mvmz.rss",
  "https://flipboard.com/@thenewsdesk/top-stories-in-sports-2v7jl084z.rss",
  "https://flipboard.com/@thenewsdesk/top-stories-in-tech-lipvqk8vz.rss",
];

const fetchResources = async () => {
  let dataMap = {};

  for (let url of magazines) {
    try {
      let response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${url}`
      );
      let data = await response.json();
      let key = data.feed.title;
      let value = data.items;
      dataMap = { ...dataMap, [key]: value };
    } catch (error) {
      console.error(error);
    }
  }

  return dataMap;
};

const populateCarousel = (newsArray) => {
  let carouselContainer = document.createElement("div");

  newsArray.forEach((newsItem, idx) => {
    let active = idx === 0 ? "active" : "";

    const carouselItem = document.createElement("div");
    carouselItem.setAttribute("class", `carousel-item ${active}`);

    const anchor_tag = document.createElement("a");
    anchor_tag.href = newsItem.link;
    anchor_tag.target = "_blank";

    let image = document.createElement("img");
    image.setAttribute("class", "d-block w-100");
    image.src = newsItem.enclosure.link;

    let heading = document.createElement("h4");
    heading.textContent = newsItem.title;

    let author = document.createElement("span");
    author.setAttribute("class", "author");
    author.textContent = newsItem.author;

    let bullet = document.createElement("span");
    bullet.setAttribute("class", "bullet");
    bullet.innerHTML = "&bull;";

    let date = document.createElement("span");
    date.setAttribute("class", "date");
    date.textContent = newsItem.pubDate
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("/")
      .slice(0, 10);

    let newsContent = document.createElement("p");
    newsContent.setAttribute("class", "content");
    newsContent.textContent = newsItem.content;

    carouselItem.appendChild(image);
    carouselItem.appendChild(heading);
    carouselItem.appendChild(author);
    carouselItem.appendChild(bullet);
    carouselItem.appendChild(date);
    carouselItem.appendChild(newsContent);
    anchor_tag.appendChild(carouselItem);

    carouselContainer.appendChild(anchor_tag);
  });

  return carouselContainer.innerHTML;
};

const getInnerHTMLForAccordion = (
  item,
  idx,
  toShow,
  areaExpanded,
  collapsed,
  newsArray
) => {
  return `
    <h2 class="accordion-header" id="panelsStayOpen-heading${idx}">
      <button
        class="accordion-button ${collapsed}"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#panelsStayOpen-collapse${idx}"
        aria-expanded="${areaExpanded}"
        aria-controls="panelsStayOpen-collapse${idx}"
      >
        ${item}
      </button>
    </h2>
    <div
      id="panelsStayOpen-collapse${idx}"
      class="accordion-collapse collapse ${toShow}"
      aria-labelledby="panelsStayOpen-heading${idx}"
    >
      <div class="accordion-body">
        <div id="carouselExampleControls${idx}" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner" id="carousel-inner-${idx}">
            ${populateCarousel(newsArray)}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${idx}" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${idx}" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>`;
};

const populateAccordions = async () => {
  let newsMap = await fetchResources();

  Object.keys(newsMap).forEach((item, idx) => {
    let newsArray = newsMap[item];
    let toShow = idx === 0 ? "show" : "";
    let areaExpanded = idx === 0 ? "true" : "false";
    let collapsed = idx === 0 ? "" : "collapsed";
    let accordionTitle = item;

    let accordionItem = document.createElement("div");
    accordionItem.setAttribute("class", "accordion-item");
    accordionItem.innerHTML = getInnerHTMLForAccordion(
      accordionTitle,
      idx,
      toShow,
      areaExpanded,
      collapsed,
      newsArray
    );

    document
      .getElementById("accordionPanelsStayOpenExample")
      .appendChild(accordionItem);

    // let hr_tag = document.createElement("hr");
    // document
    //   .getElementById("accordionPanelsStayOpenExample")
    //   .appendChild(hr_tag);
  });
};

const getFormattedDate = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate = `${dayOfWeek}, ${month} ${day}, ${year}`;
  return formattedDate;
};

document.querySelector(
  "body > div.parent-container > div.header > div.heading"
).textContent = getFormattedDate();

populateAccordions();
