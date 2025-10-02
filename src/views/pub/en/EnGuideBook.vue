<script setup>
import { ref, onMounted, computed } from 'vue'

const pageIdx = ref(1)
const contentClass = computed(() => {
  if (pageIdx.value === 1) return 'section-book cover'
  if (pageIdx.value === 2) return 'section-book list'
  return 'section-book section-book1'
})

const showPrevButton = computed(() => pageIdx.value > 3 && pageIdx.value <= 15)
const showNextButton = computed(() => pageIdx.value >= 3 && pageIdx.value < 15)

const updateActiveNav = () => {
  const links = document.querySelectorAll('.guideNav__link')
  links.forEach(link => link.classList.remove('active'))
  
  if (pageIdx.value >= 3 && pageIdx.value <= 15) {
    links[0].classList.add('active')
  } 
}

const curState = (page) => {
  const guides = document.querySelectorAll('div[id^="guide"]')
  guides.forEach(guide => guide.classList.add('off'))
  
  const currentGuide = document.querySelector(`#guide${page}`)
  if (currentGuide) {
    currentGuide.classList.remove('off')
  }

  const formattedPage = page.toString().padStart(2, '0')
  const curPageElement = document.querySelector('#curPage')
  if (curPageElement) {
    curPageElement.textContent = formattedPage
  }
}

const prevPage = () => {
  if (pageIdx.value > 1) {
    pageIdx.value--
    curState(pageIdx.value)
    updateActiveNav()
  }
}

const nextPage = () => {
  if (pageIdx.value < 15) {
    pageIdx.value++
    curState(pageIdx.value)
    updateActiveNav()
  }
}

const before = () => {
  const activeGuide = document.querySelector('div[id^="guide"]:not(.off)');
  if (activeGuide?.id) {
    const getId = activeGuide.id.split('guide')[1];
    if (getId === "3") {
      const prevButton = document.querySelector('.content.prev');
      if (prevButton) {
        prevButton.style.display = 'none';
      }
      return;
    }
    pageIdx.value = parseInt(getId) - 1;
    curState(pageIdx.value);
    updateActiveNav();
  }
}

const after = () => {
  const activeGuide = document.querySelector('div[id^="guide"]:not(.off)');
  if (activeGuide?.id) {
    const getId = activeGuide.id.split('guide')[1];
    if (getId === "15") {
      const nextButton = document.querySelector('.content.next');
      if (nextButton) {
        nextButton.style.display = 'none';
      }
      return;
    }
    pageIdx.value = parseInt(getId) + 1;
    curState(pageIdx.value);
    updateActiveNav();
  }
}

const goToPage = (page) => {
  pageIdx.value = page
  curState(pageIdx.value)
  updateActiveNav()
}

onMounted(() => {
  curState(pageIdx.value)
  updateActiveNav()
})
</script>

<template>
  <div id="content" :class="contentClass">
    <a @click="before" class="content prev" :style="{ display: showPrevButton ? 'flex' : 'none' }">
      <i aria-hidden="true" class="bi bi-arrow-left"></i>
      <span class="blind">prev</span>
    </a>
    <a @click="after" class="content next" :style="{ display: showNextButton ? 'flex' : 'none' }">
      <i aria-hidden="true" class="bi bi-arrow-right"></i>
      <span class="blind">next</span>
    </a>
    <div id="guide1">
      <h1><strong><span>Road Name Address</span></strong><span class="engLogo">Road name address</span></h1>
    </div>
    <div id="guide2" class="off">
      <ul>
        <li><div>Chapter 01<strong><span>Road Name</span><span>Address</span></strong></div>
          <a @click="() => goToPage(3)" title="Going to Chapter 01 Road Name Address"><div class="off">Chapter 01<strong><span>Road Name</span><span>Address</span></strong></div></a>
        </li>
        <li><div>Chapter 02<strong>Format of<span>Road Name</span><span>Address</span></strong></div>
          <a @click="() => goToPage(4)" title="Going to Chapter 02 Format of Road Name Address"><div class="off">Chapter 02<strong>Format of<span>Road Name</span><span>Address</span></strong></div></a>
        </li>
        <li><div>Chapter 03<strong>Assignment of<span>Road Name</span><span>Address</span></strong></div>
          <a @click="() => goToPage(5)" title="Going to Chapter 03 Assignment of Road Name Address"><div class="off">Chapter#03<strong>Assignment of<span>Road Name</span><span>Address</span></strong></div></a>
        </li>
        <li><div>Chapter 04<strong>Interpretation<span>of Road Name</span><span>Address</span></strong></div>
          <a @click="() => goToPage(11)" title="Going to Chapter 04 Interpretation of Road Name Address"><div class="off">Chapter 04<strong>Interpretation<span>of Road Name</span><span>Address</span></strong></div></a>
        </li>
        <li><div>Chapter 05<strong>English Notation<span>of Road Name</span><span>Address</span></strong></div>
          <a  @click="() => goToPage(15)" title="Going to Chapter 05 English Notation of Road Name Address"><div class="off">Chapter 05<strong>English Notation<span>of Road Name</span><span>Address</span></strong></div></a>
        </li>
      </ul>
    </div> 
    <div id="guide3" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook1.gif" alt="Chapter1 About Road Name Address - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 1 About Road Name Address</h3>
			<p>Road Name Address is a new address system. All the roads and streets are assigned identifying names. Buildings are assigned building numbers on a regular basis by road name. Road Name Address consists of a road name, a building number, and other complements(floor, room number, apt. number)</p>
			<h4>Convenient life</h4>
			<ul>
				<li>It’s easy to get directions with systematic Road Name Address.</li>
				<li>It’s efficient to promptly cope with emergency such as fires or crimes</li>
			</ul>
			<h4>Enhance national competiveness</h4>
			<ul>
				<li>It’s advisable to follow globally standardized address system.</li>
                <li>It’s beneficial to reduce time and costs for transportation.</li>
			</ul>
			<h4>The comparison the Previous Format and Road Name Addresses</h4>
			<table>	
				<caption>chapter 1 About Road Name Address - Road Name Address is a new address system. All the roads and streets are assigned identifying names. Buildings are assigned building numbers on a regular basis by road name. Road Name Address consists of a road name, a building number, and other complements(Division, Previous Format, Road Name Addresses)</caption>
				<thead>
					<tr>
						<th scope="col">Division</th>
						<th scope="col">Previous Format</th>
						<th scope="col">Road Name Addresses</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">Composition</th>
						<td>bunji –dong/-ri → Land focus</td>
						<td>Building number, Road name → Building focus</td>
					</tr>
					<tr>
						<th scope="row">use</th>
						<td>Land management (Land number) → Property protection</td>
						<td>Position Information (Building number) → Address signification</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div id="guide4" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook2.gif" alt="Chapter2 Format of Road Name Address > Details about Format of Road Name Address - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 2 Format of Road Name Address</h3>
			<h4>Details about Format of Road Name Address</h4>
			<div>
				<p>Previous Format → Road Name Address</p>
				<p>–dong/-floor Apartment name →<span>equal</span> (Apartment name), –dong/-floor</p>
				<p>-bunji –dong/-ri →<span>change</span> Building number, Road name</p>
				<p>-eup/-myun, -city/-gun/-gu, city/-do →<span>similar</span> -eup/-myun, -city/-gun/-gu, city/-do</p>
				<p>(Apartment name), –dong/-floor, Building number, Road name, -eup/-myun, -city/-gun/-gu, city/-do</p>
			</div>
			<ul>
				<li><strong>pentagon-shaped on a blue background - Private House</strong>(Seocho-dong), <em>6, Banpo-daero 23-gil,</em> Seocho-gu, Seoul</li>
				<li><strong>pentagon-shaped on a blue background - Commercial Building</strong>(Sejong-ro), 1403-ho, <em>209, Sejong-daero,</em> jongno-gu, Seoul</li>
				<li><strong>pentagon-shaped on a blue background - Apartment</strong>(Yeouido-dong, 00 Apt), 00-dong 00-ho,  <em>5, Yeouinaru-ro,</em> Youngdeongpo-gu, Seoul</li>
			</ul>
			<table>
				<caption>chapter 2 Format of Road Name Address - Details about Format of Road Name Address(Explain, Example of correct address writing, Example of incorrect address writing)</caption>
				<thead>
					<tr>
						<th scope="col">Explain</th>
						<th scope="col">Example of correct address writing</th>
						<th scope="col">Example of incorrect address writing</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">A road name is written as one word or two words</th>
						<td>Gukhoe-daero 62-gil (O)</td>
						<td>Gukhoe-daero62-gil (X)</td>
					</tr>
					<tr>
						<th scope="row">A building number shall be shown on the front of a road name</th>
						<td>9, Gukhoe-daero 62-gil (O)</td>
						<td>Gukhoe-daero 62-gil 9 (X)</td>
					</tr>
					<tr>
						<th scope="row">A comma is between a building number and -dong/-floor/-ho</th>
						<td>201-dong 101-ho, 89, Sakju-ro (O)</td>
						<td>201-dong 101-ho 89, Sakju-ro (X)</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div id="guide5" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook3.gif" alt="Chapter3 Assignment of Road Name Address > Description about road names and building numbers - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>Description about road names and building numbers</h4>
			<div>
				<p>
					Pentagon-shaped on a blue background
					the top - Sejong-dearo  <span>-Road Name</span>
					the bottom - 209  <span>-Building Number</span>
				</p>
			</div>
			<ul>
				<li>
					<h5>Road names</h5>
					Streets are distinguished by width; Daero(over 8 lanes), Ro(2~7 lanes), Gil(others) 
				</li>
				<li>
					<h5>Building numbers</h5>
					Within every 20m, buildings are assigned numbers in ascending order; Odd numbers on the left side and even numbers on the right side
				</li>
				<li>
					<h5>Street Block</h5>
					Considering straightness, directions are established in west -&gt; east, south -&gt;north
				</li>
				<li>
					<h5>Building numbering</h5>
					Priority is given to the road name closest to the main entrance of a building (all existing buildings in use are assigned building numbers)
				</li>
			</ul>
			<div>
				<ol>
					<li>No.1 Starting point signs image (The shape of the sign is a pointed pentagon on the right) Jungang-ro 1 → 359</li>
					<li>No.2 Direction signs image(The shape of the sign is rectangular) Daehan-daero 10 ↑ 600</li>
					<li>No.3 Cross-point signs image (The shape of the sign is hexagonal) 7 중앙로 Jungang-ro 9 </li>
					<li>No.4 Pentagon-shaped on a blue background, the top: Sejong-gil, the bottom: 3 (left) and  the top: Sejong-gil, the bottom: 4 (right)</li>
					<li>No.5 A circle with a blue border on a white background -daero</li>
					<li>No.6 A circle with a blue border on a white background -ro</li>
					<li>No.7 A circle with a blue border on a white background -gil</li>
					<li>No.8 Pentagon-shaped on a blue background, the top: Sejong-gil, the bottom: 12 and the top: Sejong-gil, the bottom: 10</li>
				</ol>	
			</div>
			<ol>
				<li>No.1 Current position in the starting of the ‘Jungang-ro’. The starting point is 1 and the end point 359.</li>
				<li>No.2 Current position is ‘Daehan-daero’. The direction from 10 to 600</li>
				<li>No.3 Current position is Intersection. Buildings numbered numdered below 7 are on the left(←), and buildings numbered over 9 are on the right(→)</li>
				<li>No.4 Odd numbers are on the left side and even numders on the right side</li>
				<li>No.5 -daero is a road with over 8 lanes</li>
				<li>No.6 -ro is a road between 2 and 7 lanes</li>
				<li>No.7 -gil is a road narrower than –ro</li>
				<li>No.8 The distance between buildings is about 20m</li>
			</ol>
		</div>
	</div>
    <div id="guide6" class="">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook4.gif" alt="Chapter3 Assignment of Road Name Address > (1) Road Name - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>(1) Road Name</h4>
			<div>
				<h5><strong>Serial</strong> numbering</h5>
				<dl>
					<dt>-daero/ -ro(road name) +<strong>serial number</strong> + -gil</dt>
					<dd>A serial number is assigned to -gil diverging from -daero/ -ro, based on -daero/-ro number order</dd>
				</dl>
			</div>			
			<div>
				<h5><strong>Basic</strong> numbering</h5>
				<dl>
					<dt>-daero/ -ro(road name) +<strong>basic number</strong> + -gil</dt>
					<dd>Gil number is assigned basedn on the -daero/ -ro number order</dd>
				</dl>
			</div>
			<div>
				<h5>Other numbering</h5>
				<dl>
					<dt>1-gil, 2-gil, 3-gil...</dt>
					<dd>A serial number is assigned to ‘-ro/ -gil’ reflecting local characteristics</dd>
				</dl>
			</div>
			<div>
				<h5>Numbering for additional divergence</h5>
				<dl>
					<dt>OO-ro 3Ga-gil, OO-ro 3Na-gil...</dt>
					<dd>Ga, Na, Da..-gil names are assigned to the roads diverging from -gil in basic numbers or serial numbers</dd>
				</dl>
			</div>
		</div>
	</div>
    <div id="guide7" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook5.gif" alt="Chapter3 Assignment of Road Name Address > (2) Building number - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>(2) Building number</h4>
			<div>
				<p>A building number is assigned following the bigger street’s name in case there are two main entrances on two different streets</p>
				<p>※Upon request from a building owner, the main entrance and building number can be changed.</p>
			</div>
			<div>
				<h5><strong>Sub-numbering</strong></h5>
				<ul>
					<li>In case of several buildings in one block</li>
					<li>In case of a diverging road in one block</li>
				</ul>
			</div>
			<div>
				<h5><strong>Underground</strong></h5>
				<p>In case of a store located underground, 'B' or 'jiha' sign is  added in front of a building number</p>
			</div>
		</div>
	</div>
    <div id="guide8" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook6.gif" alt="Chapter3 Assignment of Road Name Address > (3) Detailed Address (1/3) - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>(3) Detailed Address (1/3)</h4>
			<div>
				<h5>dong number</h5>
				<p>※ Starting from the main entrance, numbers are assigned in counterclockwise direction, [remarks] → : Direction of entry</p>
			</div>
			<table>
				<caption>Road Name Address - Detailed Address - Dong number : Line Pattern, Tree Pattern, Square Pattern, Parallel Pattern, Circle Pattern, Matrix Pattern information</caption>
				<colgroup>
					<col style="width:320px">
					<col style="width:320px">
					<col style="width:320px">
				</colgroup>
				<thead>
					<tr>
						<th colspan="3">Serial numbers are assigned in Arabic numerals or Korean letters(101-dong, 102-dong, 103-dong/ Ga-dong, Na-dong, Da-dong…)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th id="table_ex1">Line Pattern</th>
						<th id="table_ex2">Tree Pattern</th>
						<th id="table_ex3">Square Pattern</th>
					</tr>
					<tr>
						<td headers="table_ex1">Example of Line Pattern - In ascending order of the main entry direction(→), 101-dong, 102-dong, 103-dong</td>
						<td headers="table_ex2">Example of Tree Pattern - From the right side of the main entry direction(→) to the left side 1-dong, 2-dong, 3-dong, 4-dong, 5-dong, 6-dong</td>
						<td headers="table_ex3">Example of Square Pattern - A-dong, B-dong and C-dong are given in counterclockwise direction with respect to the main entrance</td>
					</tr>
					<tr>
						<th id="table_ex4">Parallel Pattern</th>
						<th id="table_ex5">Circle Pattern</th>
						<th id="table_ex6">Matrix Pattern</th>
					</tr>
					<tr>
						<td headers="table_ex4">Example of Parallel Pattern - The right side of the main entry direction is 1-dong, 2-dong, 3-dong/ The left side of the main entry direction is 6-dong, 5-dong, 4-dong</td>
						<td headers="table_ex5">Example of Circle Pattern - From the right side of the main entry direction(→) to the counterclockwise direction Ga-dong, Na-dong, Da-dong, Ra-dong, Ma-dong</td>
						<td headers="table_ex6">Example of Matrix Pattern - 1-dong, 2-dong, 3-dong, 4-dong, 5-dong, 6-dong depending on the direction of main entrance</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div id="guide9" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook7.gif" alt="Chapter3 Assignment of Road Name Address > (3) Detailed Address (2/3) - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>(3) Detailed Address (2/3)</h4>
			<div>
				<h5>Floor</h5>
				<p>※In case there’s only one basement, Basement is assigned to the first basement, [Remarks] → : Main entrance</p>
			</div>
			
			<table>
				<caption>Road Name Address - Detailed Address - Floor : Vertical Pattern, Underground Pattern, Overpass Pattern, Piloti Pattern, M,L,G Floor information</caption>
				<colgroup>
					<col style="width:320px">
					<col style="width:320px">
					<col style="width:320px">
				</colgroup>
				<thead>
					<tr>
						<th colspan="3">Based on the surface, serial numbers are assigned to those above the ground, ‘underground+ serial numbers’ are assigned to those in underground</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th id="table_ex7">Vertical Pattern</th>
						<th id="table_ex8">Underground Bunker pattern</th>
						<th id="table_ex9" class="no-bd-right">Overpass pattern</th>
					</tr>
					<tr>
						<td headers="table_ex7">Example of Vertical Pattern - Basement under the main entrance direction is underground 1Floor, underground 2Floor / The ground in the main entrance direction is 1Floor, 2Floor, 3Floor, 4Floor</td>
						<td headers="table_ex8">Example of Underground Bunker pattern - Basement under the main entrance direction is underground 1Floor, underground 2Floor, underground 3Floor</td>
						<td headers="table_ex9" class="no-bd-right">Example of Overpass pattern - The ground in the main entrance direction is 1Floor, 2Floor, 3Floor, 4Floor</td>
					</tr>
					<tr>
						<th id="table_ex10">Piloti pattern</th>
						<th id="table_ex11">M,L,G Floor</th>
						<th>&nbsp;</th>
					</tr>
					<tr>
						<td headers="table_ex10">Example of Piloti pattern - From the parking lot to the ground 2Floor, 3Floor</td>
						<td headers="table_ex11">Example of M,L,G Floor -  Basement under the main entrance direction is underground Floor/ The ground in the main entrance direction is 1Floor, 2Floor - Lobby not assigned</td>
						<td>&nbsp;</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div id="guide10" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook8.gif" alt="Chapter3 Assignment of Road Name Address > (3) Detailed Address (3/3) - Please refer to the text for details."></div></div>
        <div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 3  Assignment of Road Name Address</h3>
			<h4>(3) Detailed Address (3/3)</h4>
			<div>
				<h5>-ho</h5>
				<p>※ Starting from the main entrancev, numbers are assigned in counterclockwise direction, [remarks] <span>gray square</span> : Main entrance</p>
			</div>
			<table>
				<caption>Road Name Address - Detailed Address - ho : Line Layout, Spiral Layout, Parallel Layout(except), H-shape Layout information</caption>
				<colgroup>
					<col style="width:320px">
					<col style="width:320px">
					<col style="width:320px">
				</colgroup>
				<thead>
					<tr>
						<th colspan="3">Arabic numerals are assigned in orders (101-ho, 102-ho.../1-ho, 2-ho.../B1-ho, B2-ho.../B101-ho, B102-ho...)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th id="table_ex12">Line Layout</th>
						<th id="table_ex13">Spiral Layout</th>
						<th id="table_ex14">Parallel Layout(except)</th>
					</tr>
					<tr>
						<td headers="table_ex12">Example of Line Layout - In the left and right straight lines from the main entrance standard, 101-ho, 102-ho, 103-ho, 104-ho</td>
						<td headers="table_ex13">Example of Spiral Layout - In the counterclockwise from the main entrance standard, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112 </td>
						<td headers="table_ex14">Example of Parallel Layout(except) - The right side of the main entry direction is 101-ho, 102-ho, 103-ho, 105-ho/ The left side of the main entry direction is 109-ho, 108-ho, 107-ho, 106-ho</td>
					</tr>
					<tr>
						<th id="table_ex15">H-shape Layout</th>
						<th>&nbsp;</th>
						<th>&nbsp;</th>
					</tr>
					<tr>
						<td headers="table_ex15">Example of H-shape Layout - The right side of the main entry direction is 102, 103, 104, 105, 107, 108, 109, 110 ,111 ,112</td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
    <div id="guide11" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook9.gif" alt="Chapter4 Interpretation of Road Name Address > Interpretation of Road Name sign - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 4  Interpretation of Road Name Address</h3>
			<h4>Interpretation of Road Name sign</h4>
			<div>
				<ul>
					<li><span>1</span><p><strong>START POSITION</strong><span>Current position is the starting point of the 'Jungang-ro'.</span></p></li>
					<li><span>2</span><p><strong>BASIC NUMBER SIGN</strong><span>Location sings based on the Road Name address. Current position is ‘Jungang-ro 3’</span></p></li>
					<li><span>3</span><p><strong>INTERSECTION</strong><span>It is installed at an intersection. Buildings numbered under5 are on the left[←], and buildings numbered over 9 are on the right[→].</span></p></li>
					<li><span>4</span><p><strong>END POSITION</strong><span>Current position is the ending point of the 'Jungang-ro'.</span></p></li>
				</ul>
				<ul>
					<li><span>5</span><p><strong>CURRENT ROAD</strong><span>Current position is Daehan-daero 12. The direction form 12 to 60(↑)</span></p></li>
					<li><span>6</span><p><strong>ROAD AHEAD SIGN</strong><span>Jungang-ro is 200m ahead from the current position</span></p></li>
					<li><span>7</span><p><strong>BUILDING NUMBER SIGN</strong><span>It consists of a road name and a building number</span></p></li>
				</ul>
			</div>
		</div>
	</div>
    <div id="guide12" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook10.gif" alt="Chapter4.Interpretation of Road Name Address > Buliding number sign - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 4  Interpretation of Road Name Address</h3>
			<h4>Buliding number sign</h4>
			<div>
				<table>
					<caption>Use according to the Buliding number sign(In general, Normal style)</caption>
					<thead>
						<tr>
							<th scope="col" colspan="2">In general / Normal style</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Pentagon-shaped on a blue background, the top - 세종대로 Sejong-daero, the bottom - 209</td>
							<td>Square-shaped on a blue background, the top - 중앙로, the middle - 35, the bottom - Jungang-ro</td>
						</tr>
					</tbody>
				</table>
				<table>
					<caption>Use according to the Buliding number sign(Publick Offices, Cultural Heritage &lt; Tourist Attractions )</caption>
					<thead>
						<tr>
							<th scope="col">Publick Offices</th>
							<th scope="col">Cultural Heritage &lt; Tourist Attractions</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Circle in the shape of a white background and blue border, the top - Public Offices icon, the middle - 6, the bottom - 문연로 Munnyeon-ro</td>
							<td>A rounded rectangle in the shape of a white background and blue border, the top - icon,  the middle - 24, the bottom - 보성길 Boseong-gil</td>
						</tr>
					</tbody>
				</table>
				<div>
					<p>Various Building number sign</p>
					<ul>
						<li><span>Example Photo 1</span>Shining 449 plates.</li>
						<li><span>Example Photo 2</span>Brown building 80 plates.</li>
						<li><span>Example Photo 3</span>Angled plates.</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
    <div id="guide13" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook11.gif" alt="Chapter4 Interpretation of Road Name Address > Road Name sign - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 4  Interpretation of Road Name Address</h3>
			<h4>Road Name sign</h4>
			<div>
				<h5>START POSITION</h5>
				<p>Starting point signs image (The shape of the sign is a pointed pentagon on the right) 강남대로 Gangnam-daero 1 → 699</p>
				<ul>
					<li><strong>Gangnam-daero</strong>-daero means a boulevard, starting position</li>
					<li><strong>1 →</strong>Current position is a street starting position ‘1’</li>
					<li><strong>1 → 699</strong>The distance of Gangnam-daero is 6.99km (699 X 10m)</li>
				</ul>
			</div>
			<div>
				<h5>END POSITION</h5>
				<p>Daejeong-ro 23 beon-gil</p>
				<ul>
					<li><strong>A road diverging beside 230m of 'Daejeong-ro' starting point</strong></li>
					<li><strong>← 65</strong>Current position is the end of Street‘65’</li>
					<li><strong>1 → 65</strong>The length of 'Daejeong-ro' 23beon-gil is 650m (65 X 10m)</li>
				</ul>
			</div>
			
			<div>
				<h5>Intersection</h5>
				<p>Direction signs image(The shape of the sign is rectangular) 92 중앙로 Jungang-ro 96</p>
				<ul>
					<li><strong>Jungang-ro</strong>'Jungang-ro' is at the intersection ahead</li>
					<li><strong>92</strong>Buildings numbered under  92 are on the left</li>
					<li><strong>96</strong>Buildings numbered over 96 are on the light</li>
				</ul>
			</div>
			<div>
				<h5>Direction</h5>
				<p>Cross-point signs image (The shape of the sign is hexagonal) 사임당로 Saimdang-ro 92 ↑ 250</p>
				<ul>
					<li><strong>Saimdang-ro</strong>The position is in the middle of the street 'Saimdang-ro'</li>
					<li><strong>92 →</strong>Current position is Street 92</li>
					<li><strong>92 → 250</strong>The remaining distance is 1.5km ((250-92) X 10m)</li>
				</ul>
			</div>		
		</div>
	</div>
    <div id="guide14" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook12.gif" alt="Chapter4 Interpretation of Road Name Address > Road Name sign - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 4  Interpretation of Road Name Address</h3>
			<h4>Road Name sign</h4>
			<div>
				<div>
					<h5>Sign for Basic Number</h5>
					<p>Sign for Basic Number images (The sign of a square) the top : Street Name (종로 Jong-ro) , the bottom : Basic Number (2345)</p>
				</div>
				<div>
					<h5>Road Ahead Sign</h5>
					<p>Road Ahead Sign images (The sign of a rectangle) 종로 Jong-ro 200m</p>
					<ul>
						<li><strong>Jong-ro</strong>'Jong-ro' is ahead from the current position</li>
						<li><strong>200m</strong>The road is located 200m ahead from the current position</li>
					</ul>
				</div>
			</div>
			<table>
				<caption>Road Name Address for Directions(One direction, Forward Direction, Both Directions)</caption>
				<thead>
					<tr>
						<th scope="col" colspan="2">One direction</th>
						<th scope="col" rowspan="2">Forward Direction</th>
						<th scope="col" rowspan="2">Both Directions</th>
					</tr>
					<tr>
						<th scope="col">Start</th>
						<th scope="col">End</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Starting point signs image (The shape of the sign is a pointed pentagon on the right) 방배로 Bangbae-ro 1 → 71</td>
						<td>Ending point signs image (The shape of the sign is a pointed pentagon on the left) 1 → 71 방배로 Bangbae-ro</td>
						<td>For the forward direction signs image (The sign of a rectangle) 방배로 Bangbae-ro 1 ↑ 71</td>
						<td>For both direction signs image (The shape of the sign is hexagonal) 54 방배로 Bangbae-ro 58</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
<div id="guide15" class="off">
		<div class="book"><div class="inner"><img src="@images/introduction/guidebook/img-eng-guidebook13.gif" alt="Chapter5 English Notation of Road Name Address - Please refer to the text for details."></div></div>
		<div class="accessibility">
			<h1>Ministry of the Interior</h1>
			<h2>Introduction</h2>
			<h3>chapter 5  English Notation of Road Name Address</h3>
			<div>
				<p><strong><em>Notation format is from detailed address → to big district.</em> Complements such as a neighborhood name or an apartment -name can be eliminated for brief notation. If necessary, complements are written in brackets in front of the detailed address.</strong></p>
				<div>
					<span>Example) </span>
					<div>
						<p>(Gwangjang-dong, Sindo APT), 101-dong 102-ho, 78, Gwangnaru-ro 507-gil, Gwangjin-gu, Seoul</p>
					</div>
				</div>
			</div>		
			<div>
				<h4>Notation Format for main districts</h4>
				<ul>
					<li>
						<h5>District Name</h5>
						<p>Following Romanization rules for Korean letters, district names are written in Romanization. In case of Seoul(called a special city) and metropolitan cities, -si can be eliminated.</p>
						<div>
							<span>Example) </span>
							<p>서울특별시 강남구 강남대로10길 109 <span>109, Gangnam-daero 10-gil, Gangnam-gu, Seoul</span></p>
						</div>
					</li>
					<li>
						<h5>Road Name Address</h5>
						<p>Road Name Address are written in Romanization. Road Name Address includes -daero, -ro, -gil(beon-gin)</p>
						<p>※ if necessary, English abbreviations (Blvd. St. Rd.) are applied.</p>
						<div>
							<span>Example) </span>
							<p>경기도 양주시 시민로5번길 18</p>
							<ol>
								<li>18, Simin-ro 5beon-gil, Yangju-si, Gyeonggi-do</li>
							</ol>
						</div>
					</li>
					<li>
						<h5>Detailed Address</h5>
						<p>‘-dong’, ‘floor’, -ho’ are written in Romanization.</p>
						<div>
							<span>Example) </span>
							<p>대구광역시 수성구 달구벌대로323번길 56, 705동 1104호</p>
							<ol>
								<li>705-dong 1104-ho, 56, Dalgubeol-daero 323beon-gil, Suseong-gu, Daegu</li>
								<li>705-1104, 56, Dalgubeol-daero 323beon-gil, Suseong-gu, Daegu</li>
							</ol>
							<p>강원특별자치도 춘천시 퇴계로77번길 42, 3층</p>
							<ol>
								<li>3-cheung, 42, Toegye-ro 77beon-gil, Chuncheon-si, Gangwon-do</li>
							</ol>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>

    <div class="footer">
        <div class="inner">
            <p class="copy">Copyright &copy; Ministry of the Interior and Safety. All Rights reserved.</p>
            <div class="links">
                <a class="pdf" href="/dn.do?fileName=GuideBook_eng.pdf&amp;realFileName=GuideBook_eng.pdf&amp;regYmd=2016">PDF file download</a>
                <a class="kr" href="/CommonPageLink.do?link=/street/GuideBook&amp;cntcMenu=1">korean</a>
            </div>
            <div class="nav">
            <p class="current">
                <span>15</span>
                <span class="hidden">페이지 중</span>
                <strong id="curPage">{{ pageIdx.toString().padStart(2, '0') }}</strong>
                <span class="hidden">페이지</span>
            </p>
            <a class="go list" @click="() => goToPage(2)" title="contents information">contents information</a>
            <a class="go first" @click="() => goToPage(1)" title="first page">first page</a>
            <a class="go prev" @click="prevPage" title="prev page">prev page</a>
            <a class="go next" @click="nextPage" title="next page">next page</a>
            <a class="go end" @click="() => goToPage(15)" title="end page">end page</a>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
/** 가이드북 **/
.off {display:none}
[id*="guide"]{width: 100%;height: 100%}
[id*="engGuide"]{width: 100%;height: 100%}

/* 도로명주소 소개 - 도로명주소란? */
.section-book {position:absolute; left:0; top:0; right:0; bottom:60px; border-top:5px solid #186bb9; overflow:auto}
.section-book .book {padding:55px 60px 0;background: #fff;}
.section-book .book .inner {max-width:1310px; min-width:1000px; margin:0 auto}
.section-book .book .inner img {display:block; width:100%}
.section-book .accessibility {position:absolute; top:-9999px; left:-9999px; width:1px; height:1px;}
.section-book .footer {position:fixed; left:0; right:0; bottom:0; background:#000;font-size: 13px;}
.section-book .footer .inner {padding:15px 60px}
.section-book .footer .inner:after {content:""; display:block; clear:both}
.section-book .footer .inner .copy {float:left; color:#c3c3c3; height:30px; line-height:30px}
.section-book .footer .inner .nav {float:right; height:30px; position:relative; padding:0 74px 0 100px}
.section-book .footer .inner .nav .go {position:absolute; top:50%; margin-top:-15px; width:30px; height:30px; text-indent:-9999px}
.section-book .footer .inner .nav .prev {left:60px; background:url(@images/introduction/guidebook/btn-book-prev.gif)}
.section-book .footer .inner .nav .prev:hover,
.section-book .footer .inner .nav .prev:focus {background:url(@images/introduction/guidebook/btn-book-prev-active.gif)}
.section-book .footer .inner .nav .next {right:30px; background:url(@images/introduction/guidebook/btn-book-next.gif)}
.section-book .footer .inner .nav .next:hover,
.section-book .footer .inner .nav .next:focus {background:url(@images/introduction/guidebook/btn-book-next-active.gif)}
.section-book .footer .inner .nav .list {left:0; background:url(@images/introduction/guidebook/btn-book-list.gif)}
.section-book .footer .inner .nav .list:hover,
.section-book .footer .inner .nav .list:focus {background:url(@images/introduction/guidebook/btn-book-list-active.gif)}
.section-book .footer .inner .nav .first {left:30px; background:url(@images/introduction/guidebook/btn-book-first.gif)}
.section-book .footer .inner .nav .first:hover,
.section-book .footer .inner .nav .first:focus {background:url(@images/introduction/guidebook/btn-book-first-active.gif)}
.section-book .footer .inner .nav .end {right:0; background:url(@images/introduction/guidebook/btn-book-end.gif)}
.section-book .footer .inner .nav .end:hover,
.section-book .footer .inner .nav .end:focus {background:url(@images/introduction/guidebook/btn-book-end-active.gif)}
.section-book .footer .inner .nav .current {overflow:hidden}
.section-book .footer .inner .nav .current:after {content:""; display:block; clear:both}
.section-book .footer .inner .nav .current {color:#747474}
.section-book .footer .inner .nav .current strong,
.section-book .footer .inner .nav .current span {height:30px; line-height:30px; font-size:20px; font-weight:bold}
.section-book .footer .inner .nav .current span {float:right}
.section-book .footer .inner .nav .current strong {float:left; position:relative; color:#fff; margin-right:12px; padding-right:16px}
.section-book .footer .inner .nav .current strong:after {content:""; position:absolute; right:0; top:50%; margin-top:-8px; height:15px; border-right:1px solid #808080}
.section-book .footer .inner .nav .current .hidden {position:absolute; left:-9999px}
.section-book .footer .inner .links {position:absolute; left:50%; top:50%; margin-top:-10px; margin-left:-110px; width:220px; text-align:center}
.section-book .footer .inner .links a {display:inline-block; height:20px; text-align:left; text-indent:-9999px}
.section-book .footer .inner .links a ~ a {margin-left:56px}
.section-book .footer .inner .links .home {width:24px; background:url(@images/introduction/guidebook/btn-home.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .pdf {width:18px; background:url(@images/introduction/guidebook/btn-download-pdf.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .eng {width:44px; background:url(@images/introduction/guidebook/btn-eng.gif) 50% 50% no-repeat}
.section-book .footer .inner .links .kr  {width:44px; background:url(@images/introduction/guidebook/btn-kr.gif) 50% 50% no-repeat}

/* 표지 */
.section-book.cover {border-top:none; background:#283978 url(@images/introduction/guidebook/img-guidebook0.gif) center center no-repeat}
.section-book.cover h1 {position:absolute; left:0; top:50%; width:100%; margin-top:-105px; padding:20px 0 20px 60px; font-weight:400; font-size:50px; color:#fff}
.section-book.cover h1:after {display:block; content:""; clear:both}
.section-book.cover h1 > span {float:right; height:90px; margin-right:60px; padding-right:133px; font-size:18px; line-height:90px; vertical-align:middle; background:url(@images/introduction/guidebook/logo-h1.png) right center no-repeat}
.section-book.cover h1 > span.engLogo {float:right; height:90px; margin-right:60px; padding-right:133px; font-size:18px; line-height:90px; vertical-align:middle; background:url(@images/introduction/guidebook/logo-eng-h1.png) right center no-repeat}

.section-book.cover h1 > strong {position:relative; height:90px; font-weight:400; line-height:90px; vertical-align:middle}
.section-book.cover h1 > strong:after {display:inline-block; content:""; position:absolute; bottom:-30px; left:0; width:100%; height:6px; border-radius:6px; background:#fff}
.section-book.cover h1 > strong > span {margin-left:11px; color:#fece00}
/* 차례 */
.section-book.list {height:100%; border-top:none; background:#283978}
.section-book.list ul {width:100%; height:100%}
.section-book.list ul:after {display:block; content:""; clear:both}
.section-book.list ul li {float:left; position:relative; height:100%; font-size:16px; color:#fff; vertical-align:middle; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; -o-box-sizing:border-box; -ms-box-sizing:border-box; box-sizing:border-box;}
.section-book.list #guide2 ul li{width:20%;}
.section-book.list ul li ~ li {border-left:1px solid #3e4d86}
.section-book.list ul li > div {position:absolute; left:40px; top:50%; height:144px; margin-top:-132px}
.section-book.list ul li > a {position:absolute; width: 100%;height: 94%}
.section-book.list ul li strong {display: block; position: relative; padding-top: 42px; font-weight: 400; font-size: 26px;line-height: 26px;}
.section-book.list ul li strong:after {display: inline-block;  content: "";   position: absolute;   top: 16px; left: 0; width: 30px; height: 4px; border-radius: 4px; background: #fff;}

.section-book.list ul li strong > span {display:block; padding-top:7px}

.section-book.list #engGuide2 ul li{width:20%;}

/*페이지 내 이동버튼*/
.section-book .content.prev{position: absolute; left: 0;width: 10%;height: 100%; text-indent:-9999px; background: url(@images/introduction/guidebook/btn-book-left.gif) 50% 50% no-repeat;display: none}
.section-book .content.next{position: absolute; right:0;width: 10%;height: 100%; text-indent:-9999px; background: url(@images/introduction/guidebook/btn-book-right.gif) 50% 50% no-repeat;display: none}
.section-book .content.prev:hover, .section-book .content.prev:focus{background-color: #F0F0F0}
.section-book .content.next:hover, .section-book .content.next:focus{background-color: #F0F0F0}


/* 도로명주소 소개 - 아름다운길 소개 */
.section-book.design { border-top: 5px solid #186bb9; background: #F4EFDD; }
.section-book.main .content.next:hover, .section-book.mian .content.next:focus{background-color: #F4EFDD}
.section-book.design .book { padding: 0px; vertical-align: middle; display: table-cell; text-align: center; vertical-align: middle; }
.section-book.design .off {display:none !important;}
.section-book.design .book .inner > table img { display: block; width: auto; }
.section-book.design .book .inner-out { max-width: 1564px; min-width: 1000px; margin: 0 auto; border: 5px solid #ddd; padding: 1px; background:#fff; }
.section-book.design .book .inner { max-width: 1564px; min-width: 1000px; margin: 1px;}  

/* .section-book.design .content.next { position: absolute; right: 0; top:0; width: 8%; height: 100%; text-indent: -9999px; background: url(@images/introduction/guidebook/btn-book-right.gif) 50% 50% no-repeat; display: none; }
.section-book.design .content.prev { position: absolute;  left: 0; top:0; width: 8%; height: 100%; text-indent: -9999px; background: url(@images/introduction/guidebook/btn-book-left.gif) 50% 50% no-repeat; display: none; } */

.section-book.design .footer .inner .pdf{display: inline-block;margin-left:2%; width: 92px; text-align: center;height: 30px;line-height: 29px; color: #c3c3c3; border: 1px solid #c3c3c3;}
.section-book.design .footer .inner .txtDn{display: inline-block;  width: 125px; text-align: center;height: 30px;line-height: 29px; color: #c3c3c3; border: 1px solid #c3c3c3;}

.section-book.design .inPageList {position: relative;display: block;width: 100%;}
/* .section-book.design .inPageList .btn{ height: 34px; display: block;position: absolute;width: 65px;right: 0; background: url(@images/introduction/guidebook/design/2017/icon-home-blue.png) 0% 50% no-repeat; margin: 5px 15px 5px 5px;z-index: 9999; line-height: 35px; font-size: 16px;color: #1266a8;text-indent: 13px } */

.pageTotal{width: 29%;display: block;float: left;height: 100%;min-width: 423px;}
.pageTitle{width: 100%;margin-top: 22%;height: 110px;}
.pageTitle a{width:422px; height: 110px;display: inline-block;}
.pageList {margin-top: 20px;}
.pageList li{padding-top: 27px;}
.pageList a{width:313px; height: 45px;display: inline-block;margin-left: 85px;}
.blind {display:block;margin:0;position: absolute;z-index:-1;width:1px;height:1px;font-size: 1px;line-height: 1px;color:transparent;border:none;padding:0;overflow:hidden;opacity: 0;filter: alpha(opacity=0);background:none;}

.guideChapter__wrap {
    width: 100%;
    height: 100%;
    /* background:#f2f5fa url("@images/new_guide/img-bg.png") no-repeat left 0 bottom -94px; */
}
.guideChapter__list {
    display: flex;
    padding:120px 20px 0;
}
.guideChapter__box {
    width: 16%;
    border:none;
    flex:1;
    height: 450px;
    height: 450px;
    padding:0 12px;
}
.guideChapter__link {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 450px;
    border-radius: 20px;
    border:1px solid #d9dce2;
    background-color: #fff;
    background-position: left 50% bottom 51px;
    background-repeat: no-repeat;
}

/* .guideChapter__link.type01 {
    background-image: url("@images/new_guide/ic-newmenu-01-1.png");
}
.guideChapter__link.type02 {
    background-image: url("@images/new_guide/ic-newmenu-01-2.png");
}
.guideChapter__link.type03 {
    background-image: url("@images/new_guide/ic-newmenu-01-3.png");
}
.guideChapter__link.type04 {
    background-image: url("@images/new_guide/ic-newmenu-01-4.png");
}
.guideChapter__link.type05 {
    background-image: url("@images/new_guide/ic-newmenu-01-5.png");
}
.guideChapter__link.type06 {
    background-image: url("@images/new_guide/ic-newmenu-01-6.png");
}
.guideChapter__link.type07 {
    background-image: url("@images/new_guide/ic-newmenu-01-7.png");
} */
.guideChapter__title {
    margin-top:50px;
    width: 100%;
    color:#656565;
    font-size:20px;
    font-weight: 500;
    text-align: center;
}
.guideChapter__text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:114px;
    width: 100%;
    color:#111;
    font-size:30px;
    font-weight: 500;
    gap:13px;
}
.guideChapter__link i,
.guideNav__link i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: #f1f2f3;
    color:#000;
    font-size:18px;
}
@media (max-width: 1550px) {
    .guideChapter__text {
        font-size:26px;
    }
}
@media (max-width: 1440px) {
    .guideChapter__title {
        font-size:20px;
    }
    .guideChapter__text {
        font-size:20px;
        gap:3px;
    }
    .guideChapter__link i,
    .guideNav__link i { 
        width:24px;
        height:24px;
        min-width: 24px;
        font-size:12px;
    }
}

@media (max-width: 1200px) {
    .guideChapter__title {
        font-size:14px;
    }
    .guideChapter__text {
        font-size:14px;
    }
}










.guideChapter__link:hover,
.guideChapter__link:focus {
    border-color:#325ee6;
}
.guideChapter__link:hover .guideChapter__text,
.guideChapter__link:focus .guideChapter__text {
    font-weight: 700;
}
.guideChapter__link:hover .guideChapter__text i,
.guideChapter__link:focus .guideChapter__text i {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}


.guideNav__wrap {
    display:none;
    position: fixed;
    top:0;
    left:0;
    right:0;
    height: 82px;
    padding:11px 35px;
    background: #112560;
}
.guideNav__list {
    display: flex;
    gap:18px;
}
.guideNav__link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex:1;
    height: 60px;
    padding:0 12px 0 48px;
    border-radius: 12px;
    background-color: #fff;
    background-repeat: no-repeat;
}
.guideNav__link.active {
    background-color: #00aaff;
}
.guideNav__link.active .guideNav__text {
    color:#fff;
}
.guideNav__link.active .guideNav__number {
    color:#fff;
}
/* .guideNav__link.type01 {
    background-image: url("@images/new_guide/ic-newmenu-01-01.png");
    background-position: 16px 50%;
}
.guideNav__link.type02 {
    background-image: url("@images/new_guide/ic-newmenu-01-02.png");
    background-position: 16px 50%;
}
.guideNav__link.type03 {
    background-image: url("@images/new_guide/ic-newmenu-01-03.png");
    background-position: 16px 50%;
}
.guideNav__link.type04 {
    background-image: url("@images/new_guide/ic-newmenu-01-04.png");
    background-position: 16px 50%;
}
.guideNav__link.type05 {
    background-image: url("@images/new_guide/ic-newmenu-01-05.png");
    background-position: 16px 50%;
}
.guideNav__link.type06 {
    background-image: url("@images/new_guide/ic-newmenu-01-06.png");
    background-position: 16px 50%;
}

.guideNav__link.type07 {
    background-image: url("@images/new_guide/ic-newmenu-01-07.png");
    background-position: 16px 50%;
} */



.guideNav__text {
    color:#111;
    font-size:20px;
    font-weight: 500;
}
.guideNav__number {
    margin-left:0;
    color:#656565;
    font-size:18px;
    font-weight: 500;
}

.section-book1 .guideNav__wrap {
    display:block;
}

.section-book .content.next {
    width: 70px;
    height: 70px;
    right:118px;
    top:50%;
    border-radius: 50%;
    background: #f0f0f0;
    text-indent: initial;
}
.section-book .content.next:hover {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}
.section-book .content.next i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:100%;
    font-size:26px;
}

.section-book .content.prev {
    width: 70px;
    height: 70px;
    left:118px;
    top:50%;
    border-radius: 50%;
    background: #f0f0f0;
    text-indent: initial;
}
.section-book .content.prev:hover {
    background-image: linear-gradient(to top, #2b6ae5, #5a5de8);
    color:#fff;
}
.section-book .content.prev i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height:100%;
    font-size:26px;
}

@media (max-width: 1750px) {
    .guideNav__text {
        font-size:18px;
    }
}
@media (max-width: 1540px) {
    .section-book .content.prev {
        left:18px;
    }
    .section-book .content.next {
        right:18px;
    }
    .guideNav__link {
        padding:0 12px;
        background: #fff !important;
    }
    .guideNav__link.active {
        background: #00aaff !important;
    }
}
@media (max-width: 1300px) {
    .guideNav__link {justify-content: center;}
    .guideNav__link i {display: none;}
}
@media (max-width: 1100px) {
    .section-book .content.prev {
        left:0;
    }
    .section-book .content.next {
        right:0;
    }
    .guideNav__text {font-size:14px;}
    .guideNav__number {font-size:14px;}
}
@media (max-width: 970px) {
    .guideNav__text {font-size:12px;}
    .guideNav__number {font-size:12px;}
}
@media (max-width: 640px) {
    .guideNav__text {
        display: none;
    }
    .guideNav__link {
        background-color: #fff  !important;;
        background-repeat: no-repeat  !important;;
    }
    .guideNav__link.active {
        background-color: #00aaff  !important;;
        background-repeat: no-repeat  !important;;
    }
    /* .guideNav__link.type01 {
        background-image: url("@images/new_guide/ic-newmenu-01-01.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type02 {
        background-image: url("@images/new_guide/ic-newmenu-01-02.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type03 {
        background-image: url("@images/new_guide/ic-newmenu-01-03.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type04 {
        background-image: url("@images/new_guide/ic-newmenu-01-04.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type05 {
        background-image: url("@images/new_guide/ic-newmenu-01-05.png") !important;;
        background-position: 50% !important;;
    }
    .guideNav__link.type06 {
        background-image: url("@images/new_guide/ic-newmenu-01-06.png") !important;;
        background-position: 50% !important;;
    }
    
    .guideNav__link.type07 {
        background-image: url("@images/new_guide/ic-newmenu-01-07.png") !important;;
        background-position: 50% !important;;
    } */
}
</style>

