<script setup lang="ts">
import IconBulb from '~icons/material-symbols/lightbulb'
</script>

<template>
  <div class="max-w-4xl mx-auto pb-10">
    <div class="mt-10 hero">
      <div class="hero-content flex-col text-center">
        <h1 class="text-5xl font-bold">
          Report maker for the Starfish Library
        </h1>
        <div class="pt-6">
          <p class="text-lg leading-7">
            Use this tool to generate the weekly reports for the book transactions.
          </p>
          <button
            class="btn btn-primary mt-6"
            @click="() => $router.push('/exporter')">
            Get Started
          </button>
          <p class="text-sm opacity-60">
            (only works in Chrome browser currently)
          </p>
        </div>
      </div>
    </div>
    <section class="w-full mt-10 text-justify leading-7">
      <h2 class="text-3xl font-bold mb-4">What it does</h2>
      <p class="mb-4">
        You can use this tool to generate reports for a given date range (e.g. 1-31 January 2023), with day-level and week-level aggregations.
      </p>
      <ol class="list-decimal mb-6 pl-4">
        <li>Import the book database from the library website.</li>
        <li>Import the book transactions from the library website.</li>
        <li>Select the date range.</li>
        <li>The report is generated on-the-fly and you can copy-paste it into a spreadsheet (Google Sheets, Excel etc.).</li>
      </ol>
      <p class="mb-4">
        The generated report includes data on the number of books checked out, the number of books returned, as well as disaggregated data on the language, the target population/audience, and the topic/tags of the books.
      </p>
      <p class="mb-4">
        Find references to the Excel files of previous years (<a class="link link-accent" href="https://docs.google.com/spreadsheets/d/1z44vLfgDDmKwrimrvF-560vBfml8iMyEc4GJPq3-z9c/edit#gid=1102316241" target="_blank" rel="noopener noreferrer">2021</a>, <a class="link link-accent" href="https://docs.google.com/spreadsheets/u/0/d/1fQVn-BvVzhT4MgAXzusIxcFbvrazt4CUvy-Ld5scl5o/edit" target="_blank" rel="noopener noreferrer">2022</a>) and the current Excel file for <a class="link link-accent" href="https://docs.google.com/spreadsheets/d/1QdrEPKtqJZZk08PEDATNrL7Cae6i9v-Rt8eNhY5wTng/edit#gid=631796148" target="_blank" rel="noopener noreferrer">2023</a>.
      </p>
    </section>
    <section class="w-full mt-10 text-justify leading-7">
      <h2 class="text-3xl font-bold mb-4">Data requirements</h2>
      <p class="mb-4">
        In order for the exporter to work automatically, every book's data in the library website needs to be filled correctly.
      </p>
      <p class="mb-4">
        The tool will inform you about any errors or warnings found in the data.
      </p>
      <h3 class="text-xl font-bold mb-4">Tags</h3>
      <p class="mb-4">
        Every book needs to contain tags about the <strong class="font-bold">language</strong>, the <strong class="font-bold">target audience</strong> and the <strong class="font-bold">topic</strong> of the book.
      </p>
      <p class="mb-4">
        This tool uses the tags to do the necessary aggregations (e.g. 5 <em class="font-italic">Arabic</em> books checked out). Below you can see the tags that we currently use and how they are grouped.
      </p>
      <div class="overflow-x-auto w-full mb-4">
        <table class="table table-compact w-full">
          <thead>
            <tr>
              <th colspan="2" class="text-lg">Language tags</th>
            </tr>
            <tr>
              <th>Language</th>
              <th>Matching tags</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr>
              <td>
                Farsi
              </td>
              <td>
                <div class="flex items-center space-x-3">
                  Farsi
                  <br />
                  Farsi kids fiction
                  <br />
                  Farsi adults fiction
                  <br />
                  Persian
                  <br />
                  Dari
                  <br />
                  Pashto
                  <br />
                </div>
              </td>
            </tr>
            <tr>
              <td>Arabic</td>
              <td>Arabic</td>
            </tr>
            <tr>
              <td>Somali</td>
              <td>Somali</td>
            </tr>
            <tr>
              <td>French</td>
              <td>French</td>
            </tr>
            <tr>
              <td>English</td>
              <td>English</td>
            </tr>
            <tr>
              <td>German</td>
              <td>German</td>
            </tr>
            <tr>
              <td>Greek</td>
              <td>Greek</td>
            </tr>
            <tr>
              <td>Amharic</td>
              <td>Amharic</td>
            </tr>
            <tr>
              <td>Other</td>
              <td><em class="font-italic">if none matches</em></td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colspan="2" class="text-lg">Audience tags</th>
            </tr>
            <tr>
              <th>Audience</th>
              <th>Matching tags</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adults</td>
              <td>
                Adults
                <br />
                Adult
                <br />
                Adults fiction
                <br />
                Dictionary
                <br />
                Farsi adults fiction
                <br />
                <em class="font-italic">if none matches</em>
              </td>
            </tr>
            <tr>
              <td>Kids</td>
              <td>
                Kids
                <br />
                Teen
                <br />
                Farsi kids fiction
              </td>
            </tr>
          </tbody>
          <thead>
            <tr>
              <th colspan="2" class="text-lg">Topic tags</th>
            </tr>
            <tr>
              <th>Topic</th>
              <th>Matching tags</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Fiction</td>
              <td>
                Fiction
                <br />
                Farsi kids fiction
                <br />
                Adults Fiction
                <br />
                Crime Fiction
              </td>
            </tr>
            <tr>
              <td>Non fiction</td>
              <td>
                Non fiction
                <br />
                Health & Fitness
                <br />
                Travel
                <br />
                Cooking
                <br />
                Poetry
                <br />
                Magazine
              </td>
            </tr>
            <tr>
              <td>Educational/sciences</td>
              <td>
                Educational/sciences
                <br />
                Science
                <br />
                Education
                <br />
                Geography
                <br />
                Nature
                <br />
                History
                <br />
                Academic
                <br />
                Culture
                <br />
                Animals
                <br />
                Encyclopedia
                <br />
                Art
                <br />
                Creative
                <br />
                Religion
                <br />
                Handicrafts
              </td>
            </tr>
            <tr>
              <td>Languages</td>
              <td>
                Languages
                <br />
                Language Learning
                <br />
                Dictionary
                <br />
                English Readers
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mb-4">
        <IconBulb class="text-orange-400" /> The tool gives precedence to tags that are <strong class="font-bold">first in order</strong>. For example, if a book has tags "<em class="font-italic">Arabic, Adults, Greek</em>", then the book will be grouped only under <em class="font-italic">Arabic</em>.
      </p>
      <p class="mb-4">
        <IconBulb class="text-orange-400" /> Bilingual books are categorised under the language spoken by the target population (e.g. an English-Arabic book would be categorised under “<em class="font-italic">Arabic</em>” because the people most likely to read it and to borrow it are Arabic speakers and so on).
      </p>
      <p class="mb-4">
        <IconBulb class="text-orange-400" /> Dictionaries are categorised according to the main language of the vocabulary (e.g. an Arabic-Greek dictionary would have “<em class="font-italic">Arabic</em>” registered as a first language and “<em class="font-italic">Greek</em>” as a second language, in the system; a French-Greek dictionary would have “<em class="font-italic">French</em>” as a first language and “<em class="font-italic">Arabic</em>” as a second language, and so on).
      </p>
      <h3 class="text-xl font-bold mb-4">Collections</h3>
      <p class="mb-4">
        We use the “Your Library” collection for the books. This tool doesn't actually take collections into account, however, if you filter by this collection when exporting the book database (Step 1 of exporter), make sure that all relevant books are assigned to it.
      </p>
      <h3 class="text-xl font-bold mb-4">Languages</h3>
      <p class="mb-4">
        This tool doesn't use the Primary, Secondary and Original language fields, but instead determines the book language from the tags (see section above).
      </p>
      <p class="mb-4">
        However, it's best to keep these fields filled correctly and in sync with the tags (i.e. the Primary language and the first language tag should match), in case they are used in the future.
      </p>
    </section>
    <section class="w-full mt-10 text-justify leading-7">
      <h2 class="text-3xl font-bold mb-4">Known limitations</h2>
      <ul class="list-disc pl-4">
        <li>Book renewals: Renewals are unfortunately not shown in the report due to the format used by LibraryCat's transaction exporter, where renewals are recorded as one return and one check-out transaction.</li>
      </ul>
    </section>
    <section class="w-full mt-10 text-justify leading-7">
      <h2 class="text-3xl font-bold mb-4">About</h2>
      <p class="mb-4">
        This tool was developed by <a class="link link-accent" href="mailto:diamaltho@gmail.com" target="_blank" rel="noopener noreferrer">Theo Diamantidis</a> (IT volunteer) and supervised by <a class="link link-accent" href="mailto:isabella.agnitelli@gmail.com" target="_blank" rel="noopener noreferrer">Isabella Agnitelli</a> (library project manager) in 2022-2023.
      </p>
      <p class="mb-4">
        It is currently open-sourced and hosted on <a class="link link-accent" href="https://github.com/starfishfoundation/library-weekly-reports/" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
      <p class="mb-4">
        Feel free to get in contact for any questions or to get access.
      </p>
    </section>
  </div>
</template>

<style scoped>
ol {
  list-style: none;
  counter-reset: cnt;
}

ol li {
  counter-increment: cnt;
  display: flex;
  align-items: flex-end;
  margin-bottom: .5rem;
}

ol li::before {
  content: counter(cnt);
  font-weight: lighter;
  font-size: 3rem;
  margin-right: .5rem;
  line-height: 1;
}

@media (prefers-color-scheme: dark) {
  table :where(tbody th, tbody td) {
    background-color: rgb(50, 57, 66);
  }
}
</style>
