document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", function (event) {
    const columnType = event.currentTarget.getAttribute("data-type");

    // ساخت رویداد سفارشی برای نمایش منوی فیلتر
    const showFilterMenuEvent = new CustomEvent("showFilterMenu", {
      detail: { columnType, x: event.pageX, y: event.pageY },
    });

    // اجرا کردن رویداد
    document.dispatchEvent(showFilterMenuEvent);
  });
});

document.addEventListener("showFilterMenu", function (event) {
  const filterMenu = document.getElementById("filter-menu");
  const { columnType, x, y } = event.detail;

  // قرار دادن منوی فیلتر در موقعیت کلیک
  filterMenu.style.left = `${x}px`;
  filterMenu.style.top = `${y}px`;
  filterMenu.style.display = "block";

  // افزودن محتوای مناسب برای منوی فیلتر
  filterMenu.innerHTML = getFilterMenuContent(columnType);
});

function getFilterMenuContent(columnType) {
  switch (columnType) {
    case "factor":
      return `
                <label>فیلتر بر اساس فاکتور:</label>
                <input type="text" id="factor-filter" />
                <button onclick="applyFilter('factor')">اعمال</button>
            `;
    case "number":
      return `
                <label>فیلتر بر اساس شماره:</label>
                <input type="number" id="number-filter" />
                <button onclick="applyFilter('number')">اعمال</button>
            `;
    case "userId":
      return `
                <label>فیلتر بر اساس شناسه کاربر:</label>
                <input type="text" id="userId-filter" />
                <button onclick="applyFilter('userId')">اعمال</button>
            `;
    default:
      return "";
  }
}

function applyFilter(columnType) {
  const filterValue = document.getElementById(`${columnType}-filter`).value;

  // ساخت رویداد سفارشی برای ارسال فیلتر به سرور
  const applyFilterEvent = new CustomEvent("applyFilter", {
    detail: { columnType, filterValue },
  });

  // اجرا کردن رویداد
  document.dispatchEvent(applyFilterEvent);

  // بستن منوی فیلتر
  document.getElementById("filter-menu").style.display = "none";
}

document.addEventListener("applyFilter", function (event) {
  const { columnType, filterValue } = event.detail;

  // ارسال داده‌های فیلتر به سرور
  fetch("/api/filter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ columnType, filterValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("نتیجه فیلتر:", data);
      // به‌روزرسانی جدول با داده‌های فیلتر شده
    });
});

// =========================================================
