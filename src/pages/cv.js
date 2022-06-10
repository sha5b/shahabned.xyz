import React from "react";
import Layout from "./components/Layout";
import Masonry from "react-masonry-css";
import { Link, graphql } from "gatsby";
import { Helmet } from "react-helmet";
import { GatsbySeo } from "gatsby-plugin-next-seo";

const breakpointColumnsObj = {
  default: 3,
  1920: 3,
  1024: 1,
  640: 1,
};

const Cv = ({ data }) => {
  return (
    <Layout nextUrl="/about" previousUrl="/">
      <GatsbySeo
        title="Shahab Nedaei CV"
        description="Digital and Internet Art - CV of Shahab Nedaei"
        canonical="https://shahabned.xyz/cv"
        openGraph={{
          url: "https://shahabned.xyz/cv",
          title: "Shahab Nedaei CV",
          description: "Digital and Internet Art - CV of Shahab Nedaei",
        }}
      />
      <Helmet
        meta={[
          {
            name: "keywords",
            content: data.site.siteMetadata.keywords,
          },
        ]}
      />
      <Masonry breakpointCols={breakpointColumnsObj} className="cvgrid">
        <div className="cvgrid-item">
          <h1>
            <Link to="/">
              <h1>Exhibited - Real life</h1>
            </Link>
          </h1>
          <hr />

          <div>
            <h4>This_Place_ment</h4>
            <p>
              Work: <Link to="/works/echoandnarcissus/">Echo & Narcissus</Link>
            </p>
            <p>Year: 2022</p>
            <p>
              Space:{" "}
              <a href="https://www.facebook.com/RFDINSEL/">
                Reich fuer die Insel
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.facebook.com/RFDINSEL/">
                Reich fuer die Insel
              </a>
            </p>
            <p>Place: Innsbruck / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Intra-Actions: Existence is not an Individual Matter</h4>
            <p>
              Work:{" "}
              <Link to="/works/elasticloopingspaceintime/">
                Elastic looping space in time
              </Link>
            </p>
            <p>Year: 2022</p>
            <p>
              Space:{" "}
              <a href="https://ecc-italy.eu/locations/palazzomora">
                Palazzo Mora
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="http://www.fachdidaktik.or.at/venicebiennial/">
                Zentrum fuer Fachdidaktik
              </a>
            </p>
            <p>Place: Venice / Italy</p>
          </div>

          <hr />

          <div>
            <h4>This_Place_ment</h4>
            <p>
              Work: <Link to="/works/dom_ino/">dom_ino</Link>
            </p>
            <p>Year: 2021</p>
            <p>
              Space: <a href="https://www.lot.wien/">dasLot</a>
            </p>
            <p>
              Curated:{" "}
              <a href="http://rafael-ludescher.numu.at/">Rafael Ludescher</a>,
              Shahab Nedaei
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Spectre of Modernism</h4>
            <p>
              Work:{" "}
              <Link to="/works/spectreofmodernism/">Spectre of Modernism</Link>
            </p>
            <p>Year: 2021</p>
            <p>
              Space:{" "}
              <a href="https://www.mqw.at/institutionen/q21/programm/2021/03/nini-fiel-wolfgang-fiel-shahab-nedaei-spectre-of-modernism/">
                Museumsquartier 21 Schauraum Angewandte
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.dieangewandte.at/">
                Univerity of applied Arts
              </a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>#fuckreality</h4>
            <p>
              Work:{" "}
              <Link to="/works/spectreofmodernism/">Spectre of Modernism</Link>
            </p>
            <p>Year: 2018</p>
            <p>
              Space:{" "}
              <a href="https://www.kunstraum.net/en">
                Kunstraum Niederösterreich
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.dieangewandte.at/">
                Univerity of applied Arts
              </a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Design Week Vienna</h4>
            <p>
              Work: <Link to="/works/disarray/">disarray</Link>
            </p>
            <p>Year: 2018</p>
            <p>
              Space:{" "}
              <a href="https://www.viennadesignweek.at/en/">
                Design Week Vienna
              </a>
            </p>
            <p>
              Curated: <a href="https://www.burggasse98.com/">Niklas Worisch</a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Bitoresc</h4>
            <p>
              Work: <Link to="/works/alex/">A.l.ex</Link>
            </p>
            <p>Year: 2017</p>
            <p>
              Space:{" "}
              <a href="https://www.dieangewandte.at/universitaet/standorte/standort_detail?standort_id=1458411106039">
                Heiligenkreuzer Hof
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.dieangewandte.at/">
                University of applied Arts
              </a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>OT</h4>
            <p>
              Work: <Link to="/works/escargot/">Escargot</Link>
            </p>
            <p>Year: 2017</p>
            <p>
              Space: <a href="https://gaertnergasse.com/">Gärtnergasse</a>
            </p>
            <p>
              Curated:{" "}
              <a href="http://www.christiankobald.at/">Christian Kobald</a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Guerillia Exhibition</h4>
            <p>
              Work: <Link to="/works/________space/">________space</Link>
            </p>
            <p>Year: 2015</p>
            <p>
              Space:{" "}
              <a href="https://www.kunstforumwien.at/">
                Bank Austria Kunstforum
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.hgb-leipzig.de/personen/professor-innen_mitarbeiter-innen/ilselafer">
                Ilse Lafer
              </a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Heart of Noise 2015</h4>
            <p>
              Work:{" "}
              <Link to="/works/timeisthesoulofthings/">
                Time is the Soul of Things
              </Link>
            </p>
            <p>Year: 2015</p>
            <p>
              Space:{" "}
              <a href="https://www.heartofnoise.at/de/2015/home/">
                Stadthalle Innsbruck
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.heartofnoise.at/de/2015/home/">
                Heart of Noise Festival
              </a>
            </p>
            <p>Place: Austria / Innsbruck</p>
          </div>

          <hr />

          <div>
            <h4>Biennale Sessions</h4>
            <p>
              Work:{" "}
              <Link to="/works/onlinetheperformance/">
                online the performance
              </Link>
            </p>
            <p>Year: 2015</p>
            <p>
              Space:{" "}
              <a href="https://www.labiennale.org/en/art/2022/biennale-sessions">
                Arsenale
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.dieangewandte.at/">
                University of applied Arts
              </a>
            </p>
            <p>Place: Italy / Venice</p>
          </div>

          <hr />

          <div>
            <h4>Salone Degli Icanti</h4>
            <p>
              Work:{" "}
              <Link to="/works/onlinetheperformance/">
                online the performance
              </Link>
            </p>
            <p>Year: 2014</p>
            <p>
              Space:{" "}
              <a href="https://artfacts.net/institution/salone-degli-incanti-ex-pescheria-centrale/26675">
                Ex Pescheria Centrale
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.a-list.at/wien/insider/l/insider-wien-juergen-weishaeupl-kunst-projekt-artprojects-salotto-vienna-contentart-seestadt-aspern.html">
                Jürgen Weishäupl
              </a>
            </p>
            <p>Place: Trieste / Italy</p>
          </div>

          <hr />

          <div>
            <h4>Heart of Noise 2014</h4>
            <p>
              Work:{" "}
              <Link to="/works/onlinetheperformance/">
                online the performance
              </Link>
            </p>
            <p>Year: 2014</p>
            <p>
              Space:{" "}
              <a href="https://www.heartofnoise.at/de/2014/home/">
                Stadthalle Innsbruck
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.heartofnoise.at/de/2014/home/">
                Heart of Noise Festival
              </a>
            </p>
            <p>Place: Austria / Innsbruck</p>
          </div>

          <hr />

          <div>
            <h4>Premierentage</h4>
            <p>
              Work: <Link to="/works/copypasta/">copypasta.zip</Link>
            </p>
            <p>Year: 2013</p>
            <p>
              Space:{" "}
              <a href="https://diebaeckerei.at/">Bäckerei Kulturbackstube</a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://premierentage.at/2021/">Premierentage</a>
            </p>
            <p>Place: Austria / Innsbruck</p>
          </div>

          <hr />

          <div>
            <h4>Biennale Sessions</h4>
            <p>
              Work: <Link to="/works/copypasta/">copypasta.zip/</Link>
            </p>
            <p>Year: 2013</p>
            <p>
              Space:{" "}
              <a href="https://www.labiennale.org/en/art/2022/biennale-sessions">
                Arsenale
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://www.dieangewandte.at/">
                University of applied Arts
              </a>
            </p>
            <p>Place: Italy / Venice</p>
          </div>

          <hr />
        </div>

        <div className="cvgrid-item">
          <h1>
            <Link to="/">
              <h1>Exhibited - Virtual</h1>
            </Link>
          </h1>
          <hr />
          <div>
            <h4>HGM Intervention</h4>
            <p>
              Work:{" "}
              <Link to="/works/calmbeforthestorm">Calm befor the Storm</Link>
            </p>
            <p>
              Space:{" "}
              <a href="https://www.hgm.at/en">Heeresgeschichtliches Museum</a>
            </p>
            <p>
              Curated:{" "}
              <a href="https://artificialmuseum.com/#z=6&lat=49&lng=14.7&s=about">
                theartificialmuseum
              </a>
            </p>
          </div>

          <hr />

          <div>
            <h4>Bodycount</h4>
            <p>
              Work:{" "}
              <Link to="/works/stoffmeineralptraeume/">
                Der Stoff meiner Alpträume
              </Link>
            </p>
            <p>
              Space: <a href="https://www.belvedere.at/">belvedere21</a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>Randiance VR</h4>
            <p>
              Work: <Link to="/works/disarray/">disarray</Link>
            </p>
            <p>
              Space:{" "}
              <a href="https://www.radiancevr.co/artists/shahab-nedaei/">
                Radiance VR
              </a>
            </p>
            <p>
              Curated:{" "}
              <a href="http://www.peertospace.eu/tina">Tina Sauerländer</a>
            </p>
          </div>

          <hr />

          <div>
            <h4>The Emperor's New Clothes</h4>
            <p>
              Work: <Link to="/works/purplehaze/">Purple Haze</Link>
            </p>
            <p>
              Space: <a href="https://www.koeniggalerie.com/">König Gallerie</a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>My Imagination curated this</h4>
            <p>
              Work: <Link to="/works/impossimobile/">Impossi-mobile</Link>
            </p>
            <p>
              Space:{" "}
              <a href="https://www.kunstverein-hannover.de/">
                Kunstverein Hannover
              </a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>Crumbeling Castle</h4>
            <p>
              Work: <Link to="/works/ohnetitel1/">o(hne)t(itel)</Link>
            </p>
            <p>
              Space:{" "}
              <a href="https://www.kunsthalle-karlsruhe.de/en/">
                Kunsthalle Karlsruhe
              </a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>Such Curation, Much Art, WOW!</h4>
            <p>
              Work: <Link to="/works/skullandbones/">Skull and Bones</Link>
            </p>
            <p>
              Space: <a href="https://www.belvedere.at/">belvedere21</a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>Such Curation, Much Art, WOW!</h4>
            <p>
              Work: <Link to="/works/ohnetitel4/">o(hne)t(itel)</Link>
            </p>
            <p>
              Space: <a href="https://www.belvedere.at/">belvedere21</a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />

          <div>
            <h4>Such Curation, Much Art, WOW!</h4>
            <p>
              Work:{" "}
              <Link to="/works/simplewaferswafercookie/">
                Simple Wafer's Wafer Cookie
              </Link>
            </p>
            <p>
              Space: <a href="https://www.belvedere.at/">belvedere21</a>
            </p>
            <p>Curated: Shahab Nedaei</p>
          </div>

          <hr />
        </div>

        <div className="cvgrid-item">
          <h1>
            <Link to="/">
              <h1>Curated</h1>
            </Link>
          </h1>
          <hr />

          <div>
            <h4>This_Place_ment</h4>
            <p>
              Exhibition:{" "}
              <Link to="/curation/this_place_ment/">This_Place_ment</Link>
            </p>
            <p>Year: 2021</p>
            <p>
              Artists: Jorge Gomez Elizondo, ,Thomas Hochwallner, Manuel Baumer,
              Magdalena Salner, Rafael Ludescher, Shahab Nedaei
            </p>
            <p>
              Space: <a href="https://www.lot.wien/">dasLot</a>
            </p>
            <p>
              Co-Curator:{" "}
              <a href="http://rafael-ludescher.numu.at/">Rafael Ludescher</a>
            </p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>In Between</h4>
            <p>
              Exhibition: <Link to="/curation/inbetween">In Between</Link>
            </p>
            <p>Year: 2021</p>
            <p>Artists: Magdalena Salner</p>
            <p>
              Space: <a href="http://www.raumen.org/">Raumen</a>
            </p>
            <p>Co-Curator: -----</p>
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Poetics of Uncertainty</h4>
            <p>
              Exhibition:{" "}
              <Link to="/curation/poetics">Poetics of Uncertainty</Link>
            </p>
            <p>Year: 2019</p>
            <p>Artists: Claire Hentschker</p>
            <p>
              Space: <a href="https://www.suzieshride.com/">Suzie Shride</a>
            </p>
            <p>
              Co-Curator:{" "}
              <a href="http://www.martinamenegon.com/">Martina Menegon</a>
            </p>{" "}
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>Old Habits</h4>
            <p>
              Exhibition: <Link to="/curation/oldhabits">Old Habits</Link>
            </p>
            <p>Year: 2019</p>
            <p>Artists: Line Finderup Jensen</p>
            <p>
              Space: <a href="https://www.suzieshride.com/">Suzie Shride</a>
            </p>
            <p>
              Co-Curator:{" "}
              <a href="http://www.martinamenegon.com/">Martina Menegon</a>
            </p>{" "}
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>hyperartefakte</h4>
            <p>
              Exhibition:{" "}
              <Link to="/curation/hyperartefakte">hyperartefakte</Link>
            </p>
            <p>Year: 2019</p>
            <p>Artists: Xaver Gschnitzer</p>
            <p>
              Space:{" "}
              <a href="https://www.patachronique.com/permanent-archiv/hyperartefakte/">
                36|Projectcell
              </a>
            </p>
            <p>
              Co-Curator:{" "}
              <a href="http://www.martinamenegon.com/">Martina Menegon</a>
            </p>{" "}
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />

          <div>
            <h4>and when i</h4>
            <p>
              Exhibition: <Link to="/curation/andwheni">and when i</Link>
            </p>
            <p>Year: 2019</p>
            <p>Artists: Enrico Zago Caramante</p>
            <p>
              Space:{" "}
              <a href="https://www.patachronique.com/permanent-archiv/and-when-i/">
                36|Projectcell
              </a>
            </p>
            <p>
              Co-Curator:{" "}
              <a href="http://www.martinamenegon.com/">Martina Menegon</a>
            </p>{" "}
            <p>Place: Austria / Vienna</p>
          </div>

          <hr />
        </div>
      </Masonry>
    </Layout>
  );
};

export const query = graphql`
  query {
    site {
      siteMetadata {
        keywords
      }
    }
  }
`;

export default Cv;
