"use stirct";

var GlyElements = {
    nodes: [
      {
        data: {
          id: 0,
          title: '15 עצות סולידיות לבני 20+',
          text: `2.התמקדו בהכנסות
          חלק לא מבוטל מהקוראים הצעירים שמזדמנים לבלוג ולפורום הזה מקבלים את הרושם המוטעה שכדי להגיע לעצמאות כלכלית במהירות הבזק הם חייבים להפוך לגאוני השקעות ולהשיג תשואה מקסימלית על חסכונותיהם.
          
          הבעיה עם הגישה הזו היא, ובכן, שלרוב בני ה-20 אין חסכונות משמעותיים. המשמעות היא שגם אם המשקיע הצעיר יקצור תשואות פנומנליות, רווחי ההון יהיו באפן כללי צנועים מכדי לקדם אותו באופן משמעותי לעבר חופש כלכלי.
          
          אם תשקיעו, למשל, 20,000 ₪ בקרן מחקה ותשיגו תשואה נטו של 5% בשנה נתונה, הרווח (במונחים שקליים) מיתרגם ל-1,000 ₪ בלבד. אם תשקיעו 2,000 ₪ במניה אחת שתכפיל את ערכה תוך שנה, הרווח יהיה 2,000 ₪ בלבד (לפני עמלות ומסים).
          
          כשאתם בתחילת הדרך, המוקד צריך להיות הגדלת ההכנסה, ולא מיקסום התשואה.  שכר גבוה בגיל צעיר יקדם אתכם לעבר חופש כלכלי הרבה יותר מאשר תשואה פנומנלית על סכום זעיר. לכן, השקיעו בטיפוח ההון האנושי ופוטנציאל ההשתכרות שלכם. רכשו מיומנויות חדשות ומבוקשות, צברו ניסיון מעשי וקשרים רלוונטיים, ונסו למצוא דרכים חדשות לגרום לאנשים לשלם לכם עבור כל כישרון שיש לכם להציע.
          
          זכרו: שוק המניות מתגמל סבלנות בטווח הארוך. שוק העבודה, לעומתו, מתגמל נדירות בטווח הקצר. אם יש לכם מיומנות נדירה שהביקוש עבורה גבוה תוכלו להגדיל דרמטית את הסיכויים למצוא משרה  עם שכר גבוה כבר בשנות העשרים שלכם.
          
          תכנות היא דוגמה טובה. לא רק שמדובר במיומנות נדירה, מבוקשת ומתגמלת כלכלית, אלא שאדם נחוש דיו יכול ללמד את עצמו לתכנת ולהגיע תוך מספר חודשים מרמת ידע אפסית לעבודה במשרה מלאה. נקודת פתיחה טובה נמצאת, למשל, כאן.
          
          מכל מקום – אל תתעלמו מהשיקול הכלכלי בהחלטה אם ללמוד, מה ללמוד והיכן ללמוד.  השאיפה היא לרכוש מיומנות נדרשת, מעשית, שאנשים ישלמו בעדה.  אל תשרפו 3 שנים על לימודים בחוגים כמו מגדר, קרימינולוגיה או ארכיאולוגיה אשורית. אין כל רע אינהרנטי בלימודים בחוגים הללו – אך מדובר בלוקסוס עבור אנשים כמוני, שיכולים להרשות את זה לעצמם. החוגים הללו אינם מיועדים לסטודנטים תפרנים בתחילת שנות העשרים שלהם. בוער ללמוד משהו? השקיעו את הזמן והכסף ברישיון נהיגה על אוטובוס, בקורס רתכות או, כאמור, בלימודי שפת תכנות.  לימודי אכדית עתיקה היו משאת נפשכם מאז ומעולם?  סבבה – כל עוד אתם ערוכים להתמודד עם השלכות הכלכליות של ההחלטות שלכם.`,
          url: 'https://www.hasolidit.com/15-%d7%a2%d7%a6%d7%95%d7%aa-%d7%a1%d7%95%d7%9c%d7%99%d7%93%d7%99%d7%95%d7%aa-%d7%9c%d7%91%d7%a0%d7%99-20'
        }
      }, {
        data: {
          id: 1,
          title: 'Post 2',
          text: 'Text for post 2',
          url: 'https://en.wikipedia.org/wiki/Glucose_6-phosphate'
        }
      }, {
        data: {
          id: 2,
          title: 'Post 3',
          text: 'Text for post 3',
          url: 'https://en.wikipedia.org/wiki/Fructose_6-phosphate'
        }
      }, {
        data: {
          id: 3,
          title: 'Post 4',
          text: 'Text for post 4',
          url: 'https://en.wikipedia.org/wiki/Fructose_1,6-bisphosphate'
        }
      }
    ],
    edges: [
      {
        data: {
          source: 0,
          target: 1
        }
      }, {
        data: {
          source: 0,
          target: 2
        }
      }, {
        data: {
          source: 2,
          target: 3
        }
      }, {
        data: {
          source: 1,
          target: 2
        }
      }, {
        data: {
            source: 2,
            target: 1
        }
      }
    ]
  };

document.addEventListener("DOMContentLoaded", function() {
    var cy = cytoscape({
      container: document.getElementById('cy'),
      elements: GlyElements,
      style: [
        {
          selector: 'node',
          style: {
            'width': '400px',
            'height': '200px',
            'shape': 'roundrectangle'
          }
        }, {
          selector: 'node:selected',
          style: {
              "border-width": 2,
              "border-style": "solid",
              "border-color": "#3f3f3f",
              "border-opacity": 1,
              "background-color": "darkcyan"
          }
      }, {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            'width': '6px',
            'target-arrow-shape': 'triangle',
            'control-point-step-size': '140px'
          }
        }
      ],
      layout: {
        name: 'grid',
        fit: false, // it's okay if some of the graph is hidden off-screen because viewport scrolls
        columns: 3,
        avoidOverlap: true,
        avoidOverlapPadding: 80,
      }
    });

    cy.nodeHtmlLabel([{
      'query': 'node',
      'valign': 'center',
      tpl: function(data) {
        return '<div class="cy-title" dir="rtl">' + data.title + '</div>';
      }
    }]);
  
    cy.autolock(true);
  
    function panIn(target) {
      cy.animate({
        fit: {
          eles: target,
          padding: 360
        },
        duration: 700,
        easing: 'ease',
        queue: true
      });
    }
  
    // function findSuccessor(selected) {
    //   var connectedNodes;
    //   if (selected.isEdge()) {
    //     connectedNodes = selected.target();
    //   } else {
    //     connectedNodes = selected.outgoers().nodes();
    //   }
    //   var successor = connectedNodes.max(function(ele) {
    //     return Number(ele.id());
    //     // Need to use Number; otherwise, id() provide string
    //     // which messes up comparison (says that "10" < "9")
  
    //     // max returns object with value and ele
    //   });
    //   return successor.ele;
    // }
  
    // function advanceByButton(previous) {
    //   // unselecting is not strictly necessary since cy defaults to single selection
    //   previous.unselect();
    //   var nextSelect = findSuccessor(previous);
    //   if (previous.id() === cy.nodes('#10').id()) {
    //     // loop back to beginning instead of repeating pyruvate
    //     nextSelect = cy.nodes('#0');
    //   }
    //   nextSelect.select();
    //   panIn(nextSelect);
    // }
  
    var advanceButton = document.getElementById('advance');
    advanceButton.addEventListener('click', function() {
      var previous = cy.$(':selected');
      advanceByButton(previous);
    });
  
    cy.on('tap', 'node', function(event) {
      // acts as advanceByButton for manually selected nodes
      var target = event.target;
      var current = cy.$(':selected');
      if(target.id() === current.id()) {
        // window.open(target.data('url'), '_blank');
        alert('double click');
        return;
      }
      cy.nodes().unselect();
      target.select();
      panIn(target); 
    });

    cy.on('tap', 'edge', function(event) {
        panIn(event.target.target());
    });
  
    // Initialization: select first element to focus on.
    var startNode = cy.$('node[id = "0"]');
    // startNode.select();
    panIn(startNode);
  });
  