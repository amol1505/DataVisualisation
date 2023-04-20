const data = {
  female_voters: [
    { platform: "Facebook", percentage: 0.199 },
    { platform: "Instagram", percentage: 0.48 },
    { platform: "Snapchat", percentage: 0.026 },
    { platform: "Twitter", percentage: 0.051 },
    { platform: "None", percentage: 0.243 },
  ],
  male_voters: [
    { platform: "Facebook", percentage: 0.209 },
    { platform: "Instagram", percentage: 0.243 },
    { platform: "Snapchat", percentage: 0.036 },
    { platform: "Twitter", percentage: 0.078 },
    { platform: "None", percentage: 0.434 },
  ],
};

const femaleData = data.female_voters.sort(function (a, b) {
  return d3.ascending(a.percentage, b.percentage);
});

const maleData = data.male_voters.sort(function (a, b) {
  return d3.ascending(a.percentage, b.percentage);
});

const margin = { top: 30, right: 50, bottom: 70, left: 100 },
  width = 900 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const svg = d3
  .select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x0 = d3.scaleLinear().range([0, width]).domain([0, 0.5]);

const x1 = d3
  .scaleBand()
  .padding(0.1)
  .domain(["male_voters", "female_voters"])
  .range([0, width]);

const y = d3
  .scaleBand()
  .padding(0.25)
  .domain(
    femaleData.map(function (d) {
      return d.platform;
    })
  )
  .range([height, 0]);

const color = d3
  .scaleOrdinal()
  .domain(["male_voters", "female_voters"])
  .range(["blue", "pink"]);

const xAxis = d3.axisBottom(x0).tickFormat(d3.format(".0%")).tickSizeOuter(0);

const yAxis = d3.axisLeft(y).tickSizeOuter(0);

svg
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis);

const bars = svg
  .selectAll(".platform")
  .data(femaleData)
  .enter()
  .append("g")
  .attr("class", "platform")
  .attr("transform", function (d) {
    return "translate(0," + y(d.platform) + ")";
  });

bars
  .selectAll("rect")
  .data(function (d) {
    return [
      maleData.find(function (m) {
        return m.platform === d.platform;
      }).percentage,
      d.percentage,
    ];
  })
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x0(0);
  })
  .attr("y", function (d, i) {
    return i === 0 ? 0 : y.bandwidth() / 2; // shift bar by half the height of the bandwidth to center it
  })
  .attr("width", function (d) {
    return x0(d);
  })
  .attr("height", y.bandwidth() / 2)
  .attr("fill", function (d, i) {
    const colorVal = color(i === 0 ? "male_voters" : "female_voters");
    this.originalColor = colorVal; // save the original color on the element
    this.platformPercentage = d;
    if (i == 0) {
      this.gender = "male";
    } else {
      this.gender = "female";
    }
    return colorVal;
  })
  .on("mouseover", function (d, i) {
    d3.select(this)
      .transition()
      .duration(10)
      .attr("fill", function () {
        return d3.color(this.originalColor).darker(0.5);
      });

    const tooltipPlatform = this.parentNode.__data__.platform;

    //Update the tooltip position and value
    d3.select("#tooltip")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px")
      .select("#value")
      .text(
        parseFloat(this.platformPercentage * 100).toFixed(1) +
        "% of " +
        this.gender +
        " voters chose this option"
      );

    d3.select("#tooltip").select("#platform_name").text(tooltipPlatform);

    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
  })
  .on("mouseout", function (d, i) {
    d3.select(this)
      .transition()
      .duration(300)
      .attr("fill", function () {
        return this.originalColor;
      }); // restore original color

    d3.select("#tooltip").classed("hidden", true);
  });

svg
  .append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom / 1.5)
  .text("Percentage of Gender");

// Add legend
const legend = svg
  .append("g")
  .attr("class", "legend")
  .attr(
    "transform",
    "translate(" + (width - 70) + "," + (margin.top - 50) + ")"
  );

const legendItem = legend
  .selectAll(".legend-item")
  .data(color.domain())
  .enter()
  .append("g")
  .attr("class", "legend-item")
  .attr("transform", function (d, i) {
    return "translate(0," + i * 20 + ")";
  });

legendItem
  .append("rect")
  .attr("x", 0)
  .attr("y", -10)
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", color);

legendItem
  .append("text")
  .attr("x", 20)
  .attr("y", 0)
  .attr("dy", ".05em")
  .text(function (d) {
    return d === "female_voters" ? "Female" : "Male";
  });

svg.selectAll(".y.axis text").style("font-size", "16px");

svg.selectAll(".x.axis text").style("font-size", "16px");

function updateBars() {
  d3.selectAll(".percentage").remove();
  const maleChecked = document.getElementById("male_voters_checkbox").checked;
  const femaleChecked = document.getElementById(
    "female_voters_checkbox"
  ).checked;
  const facebookChecked = document.getElementById("facebook_checkbox").checked;
  const instagramChecked =
    document.getElementById("instagram_checkbox").checked;
  const snapchatChecked = document.getElementById("snapchat_checkbox").checked;
  const twitterChecked = document.getElementById("twitter_checkbox").checked;
  const noneChecked = document.getElementById("none_checkbox").checked;

  const filteredData = {};

  if (maleChecked) {
    filteredData["male_voters"] = data["male_voters"];
  }

  if (femaleChecked) {
    filteredData["female_voters"] = data["female_voters"];
  }

  const filteredPlatforms = [];

  if (facebookChecked) {
    filteredPlatforms.push("Facebook");
  }

  if (instagramChecked) {
    filteredPlatforms.push("Instagram");
  }

  if (snapchatChecked) {
    filteredPlatforms.push("Snapchat");
  }

  if (twitterChecked) {
    filteredPlatforms.push("Twitter");
  }

  if (noneChecked) {
    filteredPlatforms.push("None");
  }

  //remove any data which is part of a field that has been unchecked
  for (const key in filteredData) {
    filteredData[key] = filteredData[key].filter(function (d) {
      return filteredPlatforms.indexOf(d.platform) !== -1;
    });
  }

  // Sort filteredPlatforms array by descending order of total percentage across all voters
  filteredPlatforms.sort(function (a, b) {
    let aTotalPercentage = 0;
    let bTotalPercentage = 0;

    for (var voter in filteredData) {
      let value = filteredData[voter].find(function (d) {
        return d.platform == a;
      });
      if (value != null) {
        aTotalPercentage += value.percentage;
      }

      value = filteredData[voter].find(function (d) {
        return d.platform == b;
      });
      if (value != null) {
        bTotalPercentage += value.percentage;
      }
    }

    return d3.ascending(aTotalPercentage, bTotalPercentage);
  });

  y.domain(filteredPlatforms);

  const maxPercentage = d3.max(
    Object.values(filteredData).flatMap(function (d) {
      return d.map(function (e) {
        return e.percentage;
      });
    })
  );
  const roundedPercentage = Math.ceil(maxPercentage * 20) / 20; //round to nearest 5%
  x0.domain([0, roundedPercentage]).nice(); //if doesnt fall within nice function will find an accurate amount of ticks

  const voterScale = d3
    .scaleBand()
    .domain(["male_voters", "female_voters"])
    .range([0, y.bandwidth()]);

  const bars = svg
    .selectAll(".bar")
    .remove()
    .exit()
    .data(
      filteredPlatforms.flatMap(function (platform) {
        return Object.entries(filteredData).map(function ([key, values]) {
          const value = values.find(function (d) {
            return d.platform == platform;
          });
          if (value == null) {
            return { voter: key, platform: platform, percentage: 0 };
          } else {
            return {
              voter: key,
              platform: platform,
              percentage: value.percentage,
            };
          }
        });
      })
    )
    .enter()
    .append("g") // create a new selection for both the rect and text elements
    .attr("class", "bar");

  bars
    .append("rect")
    .attr("x", 0)
    .attr("height", voterScale.bandwidth())
    .attr("y", function (d, i) {
      if (maleChecked && femaleChecked) {
        return y(d.platform) + voterScale(d.voter); // both genders displayed
      } else {
        return y(d.platform) + voterScale.bandwidth() / 2; // only one gender displayed
      }
    })
    .attr("width", function (d) {
      return x0(d.percentage);
    })
    .attr("fill", function (d) {
      this.gender = d.voter.replace("_voters", "");

      this.tooltipPlatform = d.platform;
      this.platformPercentage = d.percentage;
      const colorVal = color(d.voter);
      this.originalColor = color(d.voter); // save the original color on the element
      return colorVal;
    })
    .on("mouseover", function (d, i) {
      d3.select(this)
        .transition()
        .duration(10)
        .attr("fill", function () {
          return d3.color(this.originalColor).darker(0.5);
        });

      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px")
        .select("#value")
        .text(
          parseFloat(this.platformPercentage * 100).toFixed(1) +
          "% of " +
          this.gender +
          " voters chose this platform"
        );

      d3.select("#tooltip").select("#platform_name").text(this.tooltipPlatform);

      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("fill", function () {
          return this.originalColor;
        }); // restore original color

      d3.select("#tooltip").classed("hidden", true);
    });

  svg.attr(
    "height",
    margin.top +
    margin.bottom +
    (y.bandwidth() + voterScale.bandwidth()) * filteredPlatforms.length
  );

  svg.select(".x.axis").transition().duration(500).call(xAxis);

  svg.select(".y.axis").transition().duration(500).call(yAxis);

  svg.selectAll(".y.axis text").style("font-size", "16px");

  svg.selectAll(".x.axis text").style("font-size", "16px");
}
