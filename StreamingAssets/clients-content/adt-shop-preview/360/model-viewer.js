const IMAGE_PATH = "img/";
const DATA_PATH = "json/";
const IFRAME_SRC = "360/index.html";

var modelViewer;

var gameData;
var _gameData;

var currentModelId;

var hotspotEls = [];
var currentHotspotEl;
var currentMobileHotspotElement;
var totalClicks = 0;

var selectHotspotNum;
var selectHotspotRetry = 0;

var hotspotsVisible = true;

var arIsSupported;
var counter = 0;

var productData = {};
var modelLoaded = false;
var dataLoaded = false;

/* -------------------------------- */
/* START */

function init360Data() {
  //console.log("initData()");

  //const dataFilePath = DATA_PATH + currentCategoryId + ".json";

  let url = window.location.href;
  let param = new URL(url).searchParams;
  let product = param.get("product");
  let data_id = param.get("data_id");
  let preview = param.get("preview");
  let edit = param.get("edit");

  if (product) {
    fetch(DATA_PATH + product + ".json")
      .then((result) => result.json())
      .then((json) => {
        productData = json;
        console.log(productData);
        gameData = productData.hotspots;
        dataLoaded = true;
        console.log("-------------productData: ", productData);
        //document.getElementById("load-logo").src = productData.logo;

        // document.getElementById()
        loadModel(
          {
            modelId: "product",
            modelSrc: productData.modelSrc,
            modelIosSrc: productData.modelIosSrc,
          },
          gameData,
          !modelLoaded
        );
      })
      .catch((err) => console.error(err));
  }

  if (data_id) {
    xurealAPI.get360DataByID(data_id).then((data) => {
      console.log("360d data: ", data.content.data);
      (productData = JSON.parse(data.content.data[0].json)),
        console.log(productData);
      gameData = productData.hotspots;
      dataLoaded = true;

      //document.getElementById("load-logo").src = productData.logo;
      // document.getElementById()
      loadModel(
        {
          modelId: "product",
          modelSrc: productData.modelSrc,
          modelIosSrc: productData.modelIosSrc,
        },
        gameData,
        !modelLoaded
      );
    });
  }

  if (preview) {
    //gEL("#tt-viewar").style.opacity = 0.0;
    //var testData = "ICAgIHsKICAgICAgICAibmFtZSI6W3sKICAgICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgICAgIH1dCiAgICAgICAgfV0sCiAgICAgICAgImRlc2NyaXB0aW9uIjogW3sKICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgfSwgewogICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgIH1dCiAgICAgfV0sCiAgICAgICAgImZsYXZvclRleHQiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJSZWxpYWJsZSBkZXRlY3Rpb24sIHJhcGlkIHJlc3BvbnNlIiwKICAgICAgICAgICAgICAgICJkZXNjIjogW3sKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIm5vcm1hbCBpdGVtIDEiCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogImJvbGQgaXRlbSAyICIsCiAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAiaXRhbGljIjp0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyBpdGVtIDMiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCBpdGVtIDQiLAogICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm51bWJlcmVkLWxpc3QiLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAibGlzdC1pdGVtIiwKICAgICAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibnVtYmVybGlzdCBpdGVtIDUiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAiYnVsbGV0ZWQtbGlzdCIsCiAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJsaXN0LWl0ZW0iLAogICAgICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bm9yZGVyZWQgbGlzdCBpdGVtIDYiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogInBhcmFncmFwaCBpdGVtIDciCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAidHlwZSI6ICJudW1iZXJlZC1saXN0IiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImxpc3QtaXRlbSIsCiAgICAgICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIkFsbCBzdHlsZXMgaXRlbSA4IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgInRpdGxlIjogIkFsYXJtcyB5b3Ugd29uJ3QgbWlzcyIsCiAgICAgICAgICAgICAgICAiZGVzYyI6ICJBdWRpYmxlIHNpcmVucyBhbmQgdmlzaWJsZSBMRURzIGhlbHAgYWxlcnQgZXZlcnlvbmUgaW4geW91ciBob21lIHRvIGdldCBvdXRzaWRlIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAidGl0bGUiOiAiQWxlcnRzIHRoZSBhdXRob3JpdGllcywgZXZlbiB3aGVuIHlvdSdyZSBhd2F5IiwKICAgICAgICAgICAgICAgICJkZXNjIjogIk1vcmUgcGVhY2Ugb2YgbWluZDsgdGhlIGZpcmUgZGVwYXJ0bWVudCB3aWxsIGJlIGFsZXJ0ZWQgZXZlbiBpZiB5b3UncmUgbm90IGhvbWUiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJBIHNtYXJ0ZXIgaG9tZSBpcyBhIHNhZmVyIGhvbWUiLAogICAgICAgICAgICAgICAgImRlc2MiOiAiLSBHZXQgYWxlcnRzIG9uIHlvdXIgbW9iaWxlIGRldmljZSBpZiBDTyBpcyBkZXRlY3RlZC4gVHVybiBvZmYgdGhlIGFpciBpbiB5b3VyIGhvbWUgdG8gc2xvdyB0aGUgY2lyY3VsYXRpb24gb2YgZGVhZGx5IGdhc2VzLiBVbmxvY2sgYWxsIHNtYXJ0LWxvY2stZXF1aXBwZWQgZG9vcnMgdG8gbGV0IGluIGZpcnN0IHJlc3BvbmRlcnMiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgInRpdGxlIjogIjI0LzcgbW9uaXRvcmluZyIsCiAgICAgICAgICAgICAgICJkZXNjIjogIk91ciBtb25pdG9yaW5nIGNlbnRlcnMgd2lsbCByZWNlaXZlIGVtZXJnZW5jeSBzaWduYWxzIGFueSB0aW1lLCBkYXkgb3IgbmlnaHQuIgogICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJleHRlcm5hbExpbmsiOiAiaHR0cHM6Ly93d3cuYWR0LmNvbS9jYXJib24tbW9ub3hpZGUtYWxhcm0iLAogICAgICAgICJxckNvZGUiOiAiaHR0cHM6Ly9jbGllbnQtYWR0Lm1lZGlhLnh1cmVhbC5jb20vbWVkaWEvY2xpZW50cy9hZHQtYXNzZXRzL2ltYWdlcy9iNWE0NWJmNy0wYWQzLTRmNGEtYTU2OS1mMDE2ZDUwYWY2OTAucG5nIiwKICAgICAgICAibG9nbyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvaW1hZ2VzLzY2M2FmM2M2LTlmNzYtNGIzMi1hNWZlLThlYTJhODQyNTg1OS5wbmciLAogICAgICAgICJtb2RlbFNyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzNhOGZhMTIwLWU4NzItNDJiYi1hMjQ0LTIwMWZhNmNkZmRjYy5nbGIiLAogICAgICAgICJtb2RlbElvc1NyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzUyYjRhN2UyLTJjNWEtNGZmZi05OWIxLWEyYTFmNzFjOWIyMC51c2R6IiwKICAgICAgICAiaG90c3BvdHMiOiAKICAgICAgICBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjgzMTgwNDUwMjM0NDAyMW0gMC4wNDQzMjkzNzg1MTYyNzVtIC0wLjAzMzMzMDk4NDc4NTkzNTM4bSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMC44OTkxNTA3OTk3NTY0NTI0bSAwLjM2MDc3OTcwNTkzMjIxNDE1bSAwLjI0NzcyMTMwMTIzMzQ1NzdtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6IFt7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogInNwYW4iLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibm9ybWFsICIKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAiYm9sZCAiLAogICAgICAgICAgICAgICAgICAgICAgImJvbGQiOiB0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyAiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCIsCiAgICAgICAgICAgICAgICAgICAgICAidW5kZXJsaW5lIjogdHJ1ZQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH1dCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjMyMjQ4NzU0MDY2MDI1MDhtIDAuMDM5NzIwNTA0NTAzMDU1OTc2bSAtMC4wNDgyODU2NzE0ODYyMTkzM20iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDA0NjQ2MjQ1MTQ5Mjg1MTIxbSAwLjk5MDc3MjAxMDE2MDgxNTNtIC0wLjEzNTQ1OTM1Mjg5OTM0ODhtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6ICJBbGxvd3MgeW91IHRvIHBlcmZvcm0gcGVyaW9kaWMgdGVzdGluZyBvZiB5b3VyIGNhcmJvbiBtb25veGlkZSBkZXRlY3Rvci4iCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwNTI0NTEzNDAzNzk1MTk4N20gMC4wNDE2MTcwMzIxNDA0OTM0Mm0gMC4wMDI5NTUwNjI4NzYxMDk0NDMzbSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMG0gMW0gMG0iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkJ1aWx0IGluIGFsYXJtIGZvciB0YW1wZXIgZGV0ZWN0aW9uIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICJob3RzcG90IjogewogICAgICAgICAgICAgICAgICAicG9zaXRpb24iOiAiMC4wMDA1MzYwMTc0OTQ5Nzk4MTgybSAwLjAyNjg3MzQ4OTA1NDUwODU2NW0gMC4wNzEwMjQ0NzY4ODk2MTM5MW0iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDI3MjA1NzkxMTM3NTIzMDg3bSAwLjgzMjIwNjYyNzcxMzY4MTVtIDAuNTUzNzk3NzczMzA1Mzg1N20iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkVuc3VyZXMgb3B0aW1hbCBjYXJib24gbW9ub3hpZGUgZGV0ZWN0b3Igc2V0dXAsIHdpdGggd2lyZWxlc3MgYW5kIGhhcmQtd2lyZWQgb3B0aW9ucy4iCiAgICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJ2aWV3QVJfYnV0dG9uIjp0cnVlLAogICAgICAgICJsaW5rT3V0X2J1dHRvbiI6ZmFsc2UsCiAgICAgICAgInByaW1hcnlCcmFuZENvbG9yIjogIiMwMDY2REQiCiAgICAgICB9CiAgIA==";
  }

  if (edit) {
    gEL("#tt-viewar").style.opacity = 0.0;
  }
}

var currentPrimaryColor;
function setPrimaryColor(clr) {
  console.log("-----color: "+ clr);
  currentPrimaryColor = clr;
}

function testPreviewData() {
  var testData =
    "ICAgIHsKICAgICAgICAibmFtZSI6W3sKICAgICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgICAgIH1dCiAgICAgICAgfV0sCiAgICAgICAgImRlc2NyaXB0aW9uIjogW3sKICAgICAgICAgInR5cGUiOiAic3BhbiIsCiAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAidGV4dCI6ICJub3JtYWwgIgogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJib2xkICIsCiAgICAgICAgICAgICAiYm9sZCI6IHRydWUKICAgICAgICAgfSwgewogICAgICAgICAgICAgInRleHQiOiAiaXRhbGljICIsCiAgICAgICAgICAgICAiaXRhbGljIjogdHJ1ZQogICAgICAgICB9LCB7CiAgICAgICAgICAgICAidGV4dCI6ICJ1bmRlcmxpbmVkIiwKICAgICAgICAgICAgICJ1bmRlcmxpbmUiOiB0cnVlCiAgICAgICAgIH1dCiAgICAgfV0sCiAgICAgICAgImZsYXZvclRleHQiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJSZWxpYWJsZSBkZXRlY3Rpb24sIHJhcGlkIHJlc3BvbnNlIiwKICAgICAgICAgICAgICAgICJkZXNjIjogW3sKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIm5vcm1hbCBpdGVtIDEiCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogImJvbGQgaXRlbSAyICIsCiAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAiaXRhbGljIjp0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyBpdGVtIDMiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCBpdGVtIDQiLAogICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgICB9LCB7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogIm51bWJlcmVkLWxpc3QiLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInR5cGUiOiAibGlzdC1pdGVtIiwKICAgICAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibnVtYmVybGlzdCBpdGVtIDUiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAiYnVsbGV0ZWQtbGlzdCIsCiAgICAgICAgICAgICAgICAgICJjaGlsZHJlbiI6IFt7CiAgICAgICAgICAgICAgICAgICAgICAidHlwZSI6ICJsaXN0LWl0ZW0iLAogICAgICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICAgICAidGV4dCI6ICJ1bm9yZGVyZWQgbGlzdCBpdGVtIDYiCiAgICAgICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgInR5cGUiOiAicGFyYWdyYXBoIiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogInBhcmFncmFwaCBpdGVtIDciCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAidHlwZSI6ICJudW1iZXJlZC1saXN0IiwKICAgICAgICAgICAgICAgICAgImNoaWxkcmVuIjogW3sKICAgICAgICAgICAgICAgICAgICAgICJ0eXBlIjogImxpc3QtaXRlbSIsCiAgICAgICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIkFsbCBzdHlsZXMgaXRlbSA4IiwKICAgICAgICAgICAgICAgICAgICAgICAgICAiYm9sZCI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgInVuZGVybGluZSI6IHRydWUKICAgICAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgICAgIH1dCiAgICAgICAgICAgICAgfV0KICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICAgInRpdGxlIjogIkFsYXJtcyB5b3Ugd29uJ3QgbWlzcyIsCiAgICAgICAgICAgICAgICAiZGVzYyI6ICJBdWRpYmxlIHNpcmVucyBhbmQgdmlzaWJsZSBMRURzIGhlbHAgYWxlcnQgZXZlcnlvbmUgaW4geW91ciBob21lIHRvIGdldCBvdXRzaWRlIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAidGl0bGUiOiAiQWxlcnRzIHRoZSBhdXRob3JpdGllcywgZXZlbiB3aGVuIHlvdSdyZSBhd2F5IiwKICAgICAgICAgICAgICAgICJkZXNjIjogIk1vcmUgcGVhY2Ugb2YgbWluZDsgdGhlIGZpcmUgZGVwYXJ0bWVudCB3aWxsIGJlIGFsZXJ0ZWQgZXZlbiBpZiB5b3UncmUgbm90IGhvbWUiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgICJ0aXRsZSI6ICJBIHNtYXJ0ZXIgaG9tZSBpcyBhIHNhZmVyIGhvbWUiLAogICAgICAgICAgICAgICAgImRlc2MiOiAiLSBHZXQgYWxlcnRzIG9uIHlvdXIgbW9iaWxlIGRldmljZSBpZiBDTyBpcyBkZXRlY3RlZC4gVHVybiBvZmYgdGhlIGFpciBpbiB5b3VyIGhvbWUgdG8gc2xvdyB0aGUgY2lyY3VsYXRpb24gb2YgZGVhZGx5IGdhc2VzLiBVbmxvY2sgYWxsIHNtYXJ0LWxvY2stZXF1aXBwZWQgZG9vcnMgdG8gbGV0IGluIGZpcnN0IHJlc3BvbmRlcnMiCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgInRpdGxlIjogIjI0LzcgbW9uaXRvcmluZyIsCiAgICAgICAgICAgICAgICJkZXNjIjogIk91ciBtb25pdG9yaW5nIGNlbnRlcnMgd2lsbCByZWNlaXZlIGVtZXJnZW5jeSBzaWduYWxzIGFueSB0aW1lLCBkYXkgb3IgbmlnaHQuIgogICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJleHRlcm5hbExpbmsiOiAiaHR0cHM6Ly93d3cuYWR0LmNvbS9jYXJib24tbW9ub3hpZGUtYWxhcm0iLAogICAgICAgICJxckNvZGUiOiAiaHR0cHM6Ly9jbGllbnQtYWR0Lm1lZGlhLnh1cmVhbC5jb20vbWVkaWEvY2xpZW50cy9hZHQtYXNzZXRzL2ltYWdlcy9iNWE0NWJmNy0wYWQzLTRmNGEtYTU2OS1mMDE2ZDUwYWY2OTAucG5nIiwKICAgICAgICAibG9nbyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvaW1hZ2VzLzY2M2FmM2M2LTlmNzYtNGIzMi1hNWZlLThlYTJhODQyNTg1OS5wbmciLAogICAgICAgICJtb2RlbFNyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzNhOGZhMTIwLWU4NzItNDJiYi1hMjQ0LTIwMWZhNmNkZmRjYy5nbGIiLAogICAgICAgICJtb2RlbElvc1NyYyI6ICJodHRwczovL2NsaWVudC1hZHQubWVkaWEueHVyZWFsLmNvbS9tZWRpYS9jbGllbnRzL2FkdC1hc3NldHMvbW9kZWxzLzUyYjRhN2UyLTJjNWEtNGZmZi05OWIxLWEyYTFmNzFjOWIyMC51c2R6IiwKICAgICAgICAiaG90c3BvdHMiOiAKICAgICAgICBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjgzMTgwNDUwMjM0NDAyMW0gMC4wNDQzMjkzNzg1MTYyNzVtIC0wLjAzMzMzMDk4NDc4NTkzNTM4bSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMC44OTkxNTA3OTk3NTY0NTI0bSAwLjM2MDc3OTcwNTkzMjIxNDE1bSAwLjI0NzcyMTMwMTIzMzQ1NzdtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6IFt7CiAgICAgICAgICAgICAgICAgICJ0eXBlIjogInNwYW4iLAogICAgICAgICAgICAgICAgICAiY2hpbGRyZW4iOiBbewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAibm9ybWFsICIKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAiYm9sZCAiLAogICAgICAgICAgICAgICAgICAgICAgImJvbGQiOiB0cnVlCiAgICAgICAgICAgICAgICAgIH0sIHsKICAgICAgICAgICAgICAgICAgICAgICJ0ZXh0IjogIml0YWxpYyAiLAogICAgICAgICAgICAgICAgICAgICAgIml0YWxpYyI6IHRydWUKICAgICAgICAgICAgICAgICAgfSwgewogICAgICAgICAgICAgICAgICAgICAgInRleHQiOiAidW5kZXJsaW5lZCIsCiAgICAgICAgICAgICAgICAgICAgICAidW5kZXJsaW5lIjogdHJ1ZQogICAgICAgICAgICAgICAgICB9XQogICAgICAgICAgICAgIH1dCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwMjMyMjQ4NzU0MDY2MDI1MDhtIDAuMDM5NzIwNTA0NTAzMDU1OTc2bSAtMC4wNDgyODU2NzE0ODYyMTkzM20iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDA0NjQ2MjQ1MTQ5Mjg1MTIxbSAwLjk5MDc3MjAxMDE2MDgxNTNtIC0wLjEzNTQ1OTM1Mjg5OTM0ODhtIgogICAgICAgICAgICAgICB9LAogICAgICAgICAgICAgICAiZGVzYyI6ICJBbGxvd3MgeW91IHRvIHBlcmZvcm0gcGVyaW9kaWMgdGVzdGluZyBvZiB5b3VyIGNhcmJvbiBtb25veGlkZSBkZXRlY3Rvci4iCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAgImhvdHNwb3QiOiB7CiAgICAgICAgICAgICAgICAgICJwb3NpdGlvbiI6ICIwLjAwNTI0NTEzNDAzNzk1MTk4N20gMC4wNDE2MTcwMzIxNDA0OTM0Mm0gMC4wMDI5NTUwNjI4NzYxMDk0NDMzbSIsCiAgICAgICAgICAgICAgICAgICJub3JtYWwiOiAiMG0gMW0gMG0iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkJ1aWx0IGluIGFsYXJtIGZvciB0YW1wZXIgZGV0ZWN0aW9uIgogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICJob3RzcG90IjogewogICAgICAgICAgICAgICAgICAicG9zaXRpb24iOiAiMC4wMDA1MzYwMTc0OTQ5Nzk4MTgybSAwLjAyNjg3MzQ4OTA1NDUwODU2NW0gMC4wNzEwMjQ0NzY4ODk2MTM5MW0iLAogICAgICAgICAgICAgICAgICAibm9ybWFsIjogIjAuMDI3MjA1NzkxMTM3NTIzMDg3bSAwLjgzMjIwNjYyNzcxMzY4MTVtIDAuNTUzNzk3NzczMzA1Mzg1N20iCiAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICJkZXNjIjogIkVuc3VyZXMgb3B0aW1hbCBjYXJib24gbW9ub3hpZGUgZGV0ZWN0b3Igc2V0dXAsIHdpdGggd2lyZWxlc3MgYW5kIGhhcmQtd2lyZWQgb3B0aW9ucy4iCiAgICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJ2aWV3QVJfYnV0dG9uIjp0cnVlLAogICAgICAgICJsaW5rT3V0X2J1dHRvbiI6ZmFsc2UsCiAgICAgICAgInByaW1hcnlCcmFuZENvbG9yIjogIiMwMDY2REQiCiAgICAgICB9CiAgIA==";
  setPreviewData(testData);
}

function setPreviewData(data) {
  var dataObj = JSON.parse(window.atob(data));
  console.log(dataObj);
  console.log("title: ", dataObj.name);

  productData = dataObj;
  console.log(productData.hotspots);
  gameData = productData.hotspots;
  dataLoaded = true;

  //document.getElementById("load-logo").src = productData.logo;

  // document.getElementById()
}

function loadModel(models, newGameData, sendProgress) {
  //console.log("loadModel() modelId:", modelId, "sendProgress:", sendProgress);

console.log("models", models);
console.log("newGameData", newGameData);
console.log("sendProgress", sendProgress);
  currentModelId = models.modelId;
  _gameData = newGameData;

  console.log(_gameData);
  modelViewer = document.createElement("model-viewer");

  modelViewer.setAttribute("disable-pan", true);
  modelViewer.setAttribute("src", models.modelSrc);
  modelViewer.setAttribute("ios-src", models.modelIosSrc);
  modelViewer.setAttribute("id", "model-viewer");
  modelViewer.setAttribute("alt", "model-viewer");
  modelViewer.setAttribute("loading", "eager");
  modelViewer.setAttribute("autoplay", "false");
  if (currentModelId == "product") {
    modelViewer.setAttribute("animation-name", "Open");
    modelViewer.setAttribute("camera-orbit", "0deg 0 1m");
  } else if (currentModelId == "product") {
    modelViewer.setAttribute("animation-name", "Open_Flip");
    modelViewer.setAttribute("camera-orbit", "180deg 0 0");
  } else if (currentModelId == "product") {
    modelViewer.setAttribute("camera-orbit", "180deg 0 0");
  }

  //modelViewer.setAttribute("poster", "poster.png");
  //modelViewer.setAttribute("interaction-prompt", "when-focused");
  //modelViewer.setAttribute("reveal", "manual");
  // modelViewer.setAttribute("field-of-view", "20");
  modelViewer.setAttribute("camera-controls", "true");
  modelViewer.setAttribute("ar", "true");
  modelViewer.setAttribute("ar-modes", "webxr scene-viewer quick-look");
  modelViewer.setAttribute("ar-scale", "fixed");
  //modelViewer.setAttribute("ar-status", "auto");
  //modelViewer.setAttribute("style", "background-color: black; rotation:360deg;");

  if (sendProgress) {
    modelViewer.addEventListener("progress", loadProgress);
    modelViewer.addEventListener("load", loadProgressComplete);
  }

  modelViewer.addEventListener("load", loadComplete);

  // modelViewer.addEventListener("ar-status", function (event) {
  //    console.log("ar-status:", event.detail.status);
  // });
  //document.getElementById('model-viewer').zoom(-100)

  setTimeout(() => {
 //   document.getElementById("model-viewer").zoom(-100);
  }, "500");

  //modelViewer.setAttribute("zoom", "-1000");

  var a, hotspotData, hotspotEl, selectEl;
  for (a in _gameData) {
    hotspotData = _gameData[a].hotspot;
    //console.log("hotspotData:", hotspotData);

    hotspotEl = document.createElement("div");

    hotspotEl.setAttribute("id", "hotspot-" + a);
    hotspotEl.setAttribute("slot", "hotspot-" + a);
    hotspotEl.setAttribute("data-position", hotspotData.position);
    hotspotEl.setAttribute("data-normal", hotspotData.normal);
    if (isStandAlone) {
      hotspotEl.setAttribute("data-visibility-attribute", "hidden");
    } else {
      hotspotEl.setAttribute("data-visibility-attribute", "visible");
    }

    //setTimeout(() => {

    //}, "2000");
    //alert("add4");

    // if (hotspotData.opacity !== undefined) {
    //    hotspotEl.style.opacity = hotspotData.opacity;
    // }
    hotspotEl.classList.add("hotspot");
    hotspotEl.style.backgroundColor = currentPrimaryColor;
    hotspotEl.style.color = currentPrimaryColor;
    hotspotEl.hotspotNum = a;

    countEl = document.createElement("div");

    countEl.setAttribute("class", "count count-" + a);
    countEl.innerHTML = counter + "/" + _gameData.length;

    const mobileCountEl = countEl.cloneNode(true);

    hotspotEl.addEventListener("click", function () {
      selectHotspot(this.hotspotNum);

      //modelViewer.setAttribute('camera-orbit',) // -----------------------------------------------

      if (
        document.getElementsByClassName("count-" + this.hotspotNum)[0]
          .innerHTML ==
        "0/" + _gameData.length
      ) {
        counter = counter + 1;

        document.getElementsByClassName(
          "count-" + this.hotspotNum
        )[0].innerHTML = counter + "/" + _gameData.length;
        document.getElementsByClassName(
          "count-" + this.hotspotNum
        )[1].innerHTML = counter + "/" + _gameData.length;
      }
    });

    titleData = _gameData[a].title;
    titleEl = document.createElement("div");
    //titeEl.innerHTML = titleData;

    // Set inner html for description el
    var hotspotDescription = "";

    if (Array.isArray(_gameData[a].desc)) {
      hotspotDescription = rtfParser.processRTF(_gameData[a].desc);
    } else {
      hotspotDescription = _gameData[a].desc;
    }
    console.log("hotspotDescription: ", hotspotDescription);
    infoData = "<div class='desc-body'>" + hotspotDescription + "</div>";

    infoEl = document.createElement("div");
    infoEl.innerHTML = infoData;

    const mobileInfoEl = infoEl.cloneNode(true);

    descEl = document.createElement("div");
    descEl.setAttribute("class", "desc");
    descEl.appendChild(countEl);
    descEl.appendChild(infoEl);
    //descEl.appendChild(titleEl)

    descEl.addEventListener("click", function () {
      selectHotspot(this.hotspotNum);
    });
    console.log(descEl);
    hotspotEl.appendChild(descEl);

    //Set inner html for counter

    // Create close button for mobile desc & add listener
    mobileCloseBtn = document.createElement("button");
    mobileCloseBtn.setAttribute("class", "close-desc-button");
    mobileCloseBtn.innerHTML = "+";
    mobileCloseBtn.hotspotNum = a;
    mobileCloseBtn.addEventListener("click", function () {
      totalClicks = 0;
      resetHotspots();
      resetAllHotspots();
      currentMobileHotspotElement.classList.remove("selectedMobile");
      // selectHotspot(this.hotspotNum);
    });

    // Create mobile description el
    mobileDescOverlay = document.createElement("div");
    mobileDescOverlay.id = `mobile-overlay-${hotspotEl.hotspotNum}`;
    mobileDescOverlay.setAttribute("class", "mobileOverlay");
    mobileDescEl = document.createElement("div");
    mobileDescEl.id = `mobile-desc-${hotspotEl.hotspotNum}`;
    mobileDescEl.setAttribute("class", "mobileDesc");
    mobileDescEl.appendChild(mobileCountEl);
    mobileDescEl.appendChild(mobileInfoEl);
    mobileDescEl.appendChild(mobileCloseBtn);

    mobileDescOverlay.appendChild(mobileDescEl);
    document.body.appendChild(mobileDescOverlay);

    selectEl = document.createElement("div");
    selectEl.classList.add("select");
    selectEl.style.borderColor = "#50BDA7";
    hotspotEl.appendChild(selectEl);

    modelViewer.appendChild(hotspotEl);

    hotspotEls[a] = hotspotEl;
    //hotspotEl.classList.add("hotspot-type");
    // hotspotEl.style.visibility = "hidden";
    //  initViewer();
  }

  gEL("#model").appendChild(modelViewer);

  var productName = GAME_CATEGORIES.find(
    (cat) => cat.id === currentModelId
  ).title;
  gEL("#tt-modal-product").innerHTML = productName;

  // var qrImg = "../img/qrcode-" + currentModelId + ".png";
  // console.log(qrImg)
  // var qrImgEl = document.getElementById("tt-modal-qrcode-img");
  // console.log(qrImgEl);
  // qrImgEl.src = qrImg;
  hideHotspots(true);
}

// function initViewer() {
//    console.log('click event added');
//    // this function sits on the overlay and closes/resets everything
//    // if there is a hotspot selected and if we have recorded more than one click on this overlay
//    gEL("#model-viewer").addEventListener("click", () => {
//          console.log('click')
//          resetHotspots();

//      })
//  }

function loadProgress(e) {
  //console.log("loadProgress()");

  var totalProgress = e.detail.totalProgress;
  console.log("totalProgress:", totalProgress);

  //if (window.parent.modelProgress) {
   // window.parent.modelProgress(totalProgress);
 // }

  if (totalProgress >= 0.98) {
    modelViewer.removeEventListener("progress", loadProgress);
  }
}

function loadProgressComplete(e) {
  //console.log("loadProgressComplete()");

  if (window.parent.modelProgress) {
    window.parent.modelProgress(1);
  }

  modelViewer.removeEventListener("progress", loadProgress);
  modelViewer.removeEventListener("load", loadProgressComplete);
}

function loadComplete(e) {
  //console.log("loadComplete(e)");
  modelViewer.addEventListener("click", () => {
    if (currentHotspotEl) {
      totalClicks++;
      if (currentHotspotEl && totalClicks > 1) {
        resetHotspots();
        totalClicks = 0;
      }
    }
  });

  var arBtnClassList =
    modelViewer.shadowRoot.querySelector(".ar-button").classList;
  if (arBtnClassList.contains("enabled")) {
    arIsSupported = true;
  } else {
    arIsSupported = false;
  }
  if (currentModelId == "fold-3") {
    modelViewer.pause();
    var startAnimation = setTimeout(function () {
      modelViewer.play();
      var stopAnimation = setTimeout(function () {
        //alert("Open")
        modelViewer.animationName = "Close";
        modelViewer.pause();
        //modelViewer.removeAttribute("animation-name");
        showHotspots();
      }, 1950);
    }, 1000);
  } else if (currentModelId == "flip-3") {
    modelViewer.pause();
    var startAnimation = setTimeout(function () {
      modelViewer.play();
      var stopAnimation = setTimeout(function () {
        //alert("Open")
        modelViewer.animationName = "Close_Flip";
        modelViewer.pause();
        //modelViewer.removeAttribute("animation-name");
        showHotspots();
      }, 1950);
    }, 1000);
  } else {
    showHotspots();
  }
  retrySelectHotspot();
}

function activateHotSports() {
  const hotspotButtons = document.querySelectorAll(".select");
  hotspotButtons.forEach((button) => {
    button.style.visibility = "visible";
  });
}

function testAnimation() {
  //alert("animating");
}

function retrySelectHotspot() {
  //console.log("retrySelectHotspot()");

  if (selectHotspotRetry > 1000) {
    console.error("Couldn't Select Hotspot:", selectHotspotNum);
    return;
  }

  if (selectHotspotNum) {
    selectHotspot(selectHotspotNum);
  }
}

// function updateHotspot(hotspotNum, answerResult) {
//    //console.log("updateHotspot(" + hotspotNum + "," + answerResult + ")");

//    if (currentHotspotEl) {
//       currentHotspotEl.classList.remove("selected");
//       currentHotspotEl = undefined;
//    }

//    const hotspotEl = hotspotEls[hotspotNum];

//    hotspotEl.classList.remove("correct");
//    hotspotEl.classList.remove("wrong");

//    hotspotEl.classList.add(answerResult);
// }

function selectHotspot(hotspotNum) {
  if (currentHotspotEl) {
    currentHotspotEl.classList.remove("selected");
  }

  if (currentMobileHotspotElement) {
    currentMobileHotspotElement.classList.remove("selectedMobile");
  }

  currentHotspotEl = hotspotEls[hotspotNum];
  currentMobileHotspotElement = document.getElementById(
    `mobile-overlay-${hotspotNum}`
  );

  if (
    currentHotspotEl &&
    document.getElementsByClassName("change-opacity").length === 0
  ) {
    currentHotspotEl.classList.add("selected");

    // flip the model if the hotspot is one the other side
    modelViewer.addEventListener(
      "click",
      (event) => {
        let points = modelViewer.positionAndNormalFromPoint(
          event.clientX,
          event.clientY
        );

        let currentVector = [
          points?.normal?.x ?? 0,
          points?.normal?.y ?? 0,
          points?.normal?.z ?? 0,
        ];
        let hotspotVector = _gameData[hotspotNum].hotspot.normal
          .split(" ")
          .map((point) => parseFloat(point));
        // console.log(currentVector);
        // console.log(hotspotVector);
        let eq1 =
          hotspotVector[0] * currentVector[0] +
          hotspotVector[1] * currentVector[1] +
          hotspotVector[2] * currentVector[2];
        let eq2 = Math.sqrt(
          Math.pow(hotspotVector[0], 2) +
            Math.pow(hotspotVector[1], 2) +
            Math.pow(hotspotVector[2], 2)
        );
        let eq3 = Math.sqrt(
          Math.pow(currentVector[0], 2) +
            Math.pow(currentVector[1], 2) +
            Math.pow(currentVector[2], 2)
        );
        let angle = Math.acos(eq1 / (eq2 * eq3));
        // console.log(angle);
        // console.log(angle - modelViewer.getCameraOrbit().phi);
        //console.log(modelViewer.getCameraOrbit().theta);
        if (
          !(
            currentVector[0].toFixed(1) === hotspotVector[0].toFixed(1) &&
            currentVector[1].toFixed(1) === hotspotVector[1].toFixed(1) &&
            currentVector[2].toFixed(1) === hotspotVector[2].toFixed(1)
          )
        ) {
          let theta =
            currentVector[2] < 0 && hotspotVector[2] >= 0
              ? "0deg"
              : currentVector[2] >= 0 && hotspotVector[2] < 0
              ? "-180deg"
              : currentVector[1] >= 0 &&
                hotspotVector[1] < 0 &&
                currentVector[2] < 0 &&
                hotspotVector[2] < 0
              ? "-180deg"
              : "0deg";

          let phi = 0;

          if (
            (currentVector[1] < 0 && hotspotVector[1] < 0) ||
            (currentVector[1] > 0 && hotspotVector[1] > 0)
          ) {
            phi = angle + modelViewer.getCameraOrbit().phi;
          } else {
            phi = angle - modelViewer.getCameraOrbit().phi;
          }

          console.log(phi);
          modelViewer.setAttribute(
            "camera-orbit",

            `${theta} ${phi}rad 1m`
          );
        }
      },
      { once: true }
    );

    currentHotspotEl.style.backgroundColor = "#50BDA7";
  }
  if (currentMobileHotspotElement)
    currentMobileHotspotElement.classList.add("selectedMobile");

  hideHotspots(true);
}

function clearSelectedHotspot() {
  if (currentHotspotEl) {
    currentHotspotEl.classList.remove("selected");

    currentHotspotEl = undefined;
  }
}

function modelVisible() {
  //console.log("modelVisible()");
  // showHotspots();
}

function showHotspots(transparent = true) {
  //console.log("showHotspots()");

  hotspotsVisible = true;

  for (var a in hotspotEls) {
    const hotspotEl = hotspotEls[a];
    hotspotEl.classList.remove("hide");
  }
}

function hideHotspots(transparent = false) {
  //console.log("hideHotspots()");

  hotspotsVisible = false;

  for (var a in hotspotEls) {
    const hotspotEl = hotspotEls[a];
    if (currentHotspotEl && currentHotspotEl.id !== hotspotEl.id) {
      if (transparent) {
        hotspotEl.classList.add("change-opacity");
      } else {
        hotspotEl.classList.add("hide");
      }
    }

    // if (isStandAlone) {
    //hotspotEl.setAttribute("data-visibility-attribute", "hidden");
    // }
  }
}

function hideAllHotspots() {
  //console.log("hideHotspots()");

  for (let i = 0; i < hotspotEls.length; i++) {
    hotspotEls[i].classList.add("hide");
  }

  /*for (var a in hotspotEls) {
    const hotspotEl = hotspotEls[a];
    if (currentHotspotEl && currentHotspotEl.id !== hotspotEl.id)
      hotspotEl.classList.add("hide");
     // if (isStandAlone) {
      hotspotEl.setAttribute("data-visibility-attribute", "hidden");
     // }
  }*/
}

function resetAllHotspots() {
  //console.log("hideHotspots()");

  for (let i = 0; i < hotspotEls.length; i++) {
    hotspotEls[i].classList.remove("hide");
    // hotspotEls[i].style.opacity = 1;
  }

  /*for (var a in hotspotEls) {
    const hotspotEl = hotspotEls[a];
    if (currentHotspotEl && currentHotspotEl.id !== hotspotEl.id)
      hotspotEl.classList.add("hide");
     // if (isStandAlone) {
      hotspotEl.setAttribute("data-visibility-attribute", "hidden");
     // }
  }*/
}

function resetHotspots() {
  //console.log("resetHotspots()");

  for (var a in hotspotEls) {
    const hotspotEl = hotspotEls[a];
    hotspotEl.classList.remove("selected");
    hotspotEl.classList.remove("hide");
    hotspotEl.classList.remove("change-opacity");
  }
  currentHotspotEl = false;
}

/* -------------------------------- */
/* SHARED */

function gEL(id) {
  return document.querySelector(id);
}

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/* -------------------------------- */
/* AR Mode */

async function startAR() {
  console.log("AR-DEBUG-KEY startingAR()");

  if (arIsSupported) {
    console.log("AR-DEBUG-KEY AR is supported");

    hideAllHotspots();

    const arResult = await modelViewer.activateAR();
    console.log("AR-DEBUG-KEY arResult:", arResult);
  } else {
    showModal("viewar");
  }
}

/* -------------------------------- */
/* MODALS */

var currentModalId;

var hotspotsWereVisible;

function showModal(modalId) {
  //console.log("showModal(" + modalId + ")");

  if (currentModalId) {
    hideModal();
  }

  if (!isStandAlone) {
    window.parent.showModal(modalId);
    return;
  }

  hotspotsWereVisible = hotspotsVisible;
  hideHotspots();

  gsap.to("#tt-" + modalId + "-modal", 0.25, { autoAlpha: 1, display: "flex" });

  currentModalId = modalId;
}

function hideModal() {
  console.log("hideModal1()");

  gsap.to("#tt-" + currentModalId + "-modal", 0.25, {
    autoAlpha: 0,
    display: "none",
  });

  currentModalId = null;

  if (hotspotsWereVisible) {
    showHotspots();
  }
}

function addCloseClick(elements) {
  //console.log("addCloseClick()");

  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("click", function () {
      hideModal();
    });
  }
}

addCloseClick(document.getElementsByClassName("tt-modal-close"));
addCloseClick(document.getElementsByClassName("tt-fadeout"));
addCloseClick(document.getElementsByClassName("tt-modal-accept"));

/* -------------------------------- */
/* START */

var GAME_CATEGORIES = [
  {
    id: "product",
    title: "product",
  },
];

var isStandAlone = false;
if (window.parent === window) {
  isStandAlone = true;
}
console.log("isStandAlone:", isStandAlone);

if (isStandAlone) {
  xurealAPI.initEnv("https://client-adt.dev.xureal.com/");
  document.addEventListener("DOMContentLoaded", function () {
    init360Data();
    gEL("#tt-viewar").addEventListener("click", function () {
      // enable to open ar in new tab
      let url = window.location.href;
      let param = new URL(url).searchParams;
      let app = param.get("app");
      if (app && app == "ios") {
        console.log("loading schema url");
        window.location.href = `unity://openexternal?link=${window.location.pathname}${window.location.search}&armode=true`;
        return;
      }
      startAR();
    });
  });
} else {
  gEL("#tt").style.display = "none";
}


function testFunction(data) {
console.log("called: "+data);
}

window.addEventListener('message', event => {
console.log(event.data);

window[event.data.function];

var fn = window[event.data.function];
if(typeof fn === 'function') {

  if (event.data.function == "loadModel") {
    fn(event.data.data, event.data.gameData, event.data.flag);
  } else {
    fn(event.data.data);
  }
}

});