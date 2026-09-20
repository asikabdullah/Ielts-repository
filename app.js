const root =
  document.documentElement;

const themeToggle =
  document.getElementById(
    "themeToggle"
  );

const searchBox =
  document.getElementById(
    "searchBox"
  );

const typeFilter =
  document.getElementById(
    "typeFilter"
  );

const skillFilter =
  document.getElementById(
    "skillFilter"
  );

const cards =
  [
    ...document.querySelectorAll(
      ".resource-card"
    )
  ];

const savedCount =
  document.getElementById(
    "savedCount"
  );

const toast =
  document.getElementById(
    "toast"
  );

const emptyMessage =
  document.getElementById(
    "emptyMessage"
  );


function getInitialTheme() {

  const storedTheme =
    localStorage.getItem(
      "ielts-theme"
    );

  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}


function setTheme(theme) {

  root.setAttribute(
    "data-theme",
    theme
  );

  localStorage.setItem(
    "ielts-theme",
    theme
  );

  themeToggle.textContent =
    theme === "dark"
      ? "☀️ Light"
      : "🌙 Dark";
}


setTheme(
  getInitialTheme()
);


themeToggle.addEventListener(
  "click",
  event => {

    event.preventDefault();

    const current =
      root.getAttribute(
        "data-theme"
      );

    setTheme(
      current === "dark"
        ? "light"
        : "dark"
    );

  }
);


function showToast(
  message
) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout =
    setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      1800
    );

}


function getFavorites() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "ielts-favorites"
      ) || "[]"
    );

  } catch {

    return [];

  }

}


function saveFavorites(
  favorites
) {

  localStorage.setItem(
    "ielts-favorites",
    JSON.stringify(
      favorites
    )
  );

}


function syncFavorites() {

  const favorites =
    new Set(
      getFavorites()
    );

  cards.forEach(
    card => {

      const button =
        card.querySelector(
          ".favorite"
        );

      const saved =
        favorites.has(
          card.dataset.id
        );

      button.classList.toggle(
        "saved",
        saved
      );

      button.textContent =
        saved
          ? "★"
          : "☆";

    }
  );

  savedCount.textContent =
    favorites.size;

}


cards.forEach(
  card => {

    const favoriteButton =
      card.querySelector(
        ".favorite"
      );

    favoriteButton.addEventListener(
      "click",
      () => {

        const favorites =
          new Set(
            getFavorites()
          );

        const id =
          card.dataset.id;

        if (
          favorites.has(id)
        ) {

          favorites.delete(id);

          showToast(
            "Resource removed"
          );

        } else {

          favorites.add(id);

          showToast(
            "Resource saved"
          );

        }

        saveFavorites(
          [...favorites]
        );

        syncFavorites();

      }
    );

  }
);


syncFavorites();


function applyFilters() {

  const query =
    searchBox.value
      .trim()
      .toLowerCase();

  const selectedType =
    typeFilter.value;

  const selectedSkill =
    skillFilter.value;

  let visibleCount =
    0;

  cards.forEach(
    card => {

      const cardText =
        (
          card.dataset.name +
          " " +
          card.textContent
        ).toLowerCase();

      const queryMatches =
        !query ||
        cardText.includes(
          query
        );

      const typeMatches =
        selectedType ===
          "all" ||
        card.dataset.type ===
          selectedType;

      const skillMatches =
        selectedSkill ===
          "all" ||
        card.dataset.skill ===
          "all" ||
        card.dataset.skill ===
          selectedSkill;

      const visible =
        queryMatches &&
        typeMatches &&
        skillMatches;

      card.classList.toggle(
        "hidden",
        !visible
      );

      if (visible) {
        visibleCount++;
      }

    }
  );

  emptyMessage.hidden =
    visibleCount !== 0;

}


searchBox.addEventListener(
  "input",
  applyFilters
);

typeFilter.addEventListener(
  "change",
  applyFilters
);

skillFilter.addEventListener(
  "change",
  applyFilters
);


document
  .querySelectorAll(
    ".chip"
  )
  .forEach(
    chip => {

      chip.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".chip"
            )
            .forEach(
              item => {
                item.classList.remove(
                  "active"
                );
              }
            );

          chip.classList.add(
            "active"
          );

          typeFilter.value =
            chip.dataset.chip;

          applyFilters();

        }
      );

    }
  );


document
  .querySelectorAll(
    ".accordion-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const accordion =
            button.closest(
              ".accordion"
            );

          const opened =
            accordion.classList.toggle(
              "open"
            );

          button.querySelector(
            "span"
          ).textContent =
            opened
              ? "−"
              : "＋";

        }
      );

    }
  );


document
  .getElementById(
    "subscribeForm"
  )
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      showToast(
        "Study list ready!"
      );

      event.currentTarget.reset();

    }
  );