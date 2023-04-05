const Mgrs = require("./mgrs");
const BinarySearchBounds = require("./binarySearchBounds.js");

describe('mgrs', () => {
  function test_utm_to_mgrs(square, mgrs_origin_in_utm) {
    // eslint-disable-next-line no-console
    console.log(
      'Testing MGRS Square: ' +
        square.utm_zone +
        square.lat_band +
        square.column +
        square.row
    );
    const mgrsInst = new Mgrs.Mgrs();

    const origin1 = mgrsInst.mgrs_square_origin(square);

    // Test that mgrs_square_origin function matches the provided origin
    // ASSERT_EQ(mgrs_origin_in_utm, mgrs_square_origin(square));
    expect(mgrs_origin_in_utm[0]).toBe(
      mgrsInst.mgrs_square_origin(square)[0]
    );
    expect(mgrs_origin_in_utm[1]).toBe(
      mgrsInst.mgrs_square_origin(square)[1]
    );

    // Middle of relevant MGRS zone in UTM Coordinates
    const middle_of_zone = [
      mgrs_origin_in_utm[0] + 50000.0,
      mgrs_origin_in_utm[1] + 50000.0,
    ];

    // Distance to extend test points outward in northing and easting direction from middle of zone
    const range_m = 200000;
    const increment_m = 500;

    // Test a grid of UTM points, extending out past the mgrs zone into other zones
    for (
      let utm_easting = middle_of_zone[0] - range_m;
      utm_easting <= middle_of_zone[0] + range_m;
      utm_easting += increment_m
    ) {
      const expected_mgrs_easting = utm_easting - mgrs_origin_in_utm[0];

      for (
        let utm_northing = middle_of_zone[1] - range_m;
        utm_northing <= middle_of_zone[1] + range_m;
        utm_northing += increment_m
      ) {
        const expected_mgrs_northing = utm_northing - mgrs_origin_in_utm[1];

        const result = mgrsInst.utm_to_mgrs_square(
          [utm_easting, utm_northing],
          square
        );

        expect(result.EN[0]).toBe(expected_mgrs_easting);
        expect(result.EN[1]).toBe(expected_mgrs_northing);
      }
    }
  }

  test('lowerBound', () => {
    const array = [100, 200, 300, 300, 300, 500, 600, 1000, 5000, 10000];
    //todo: issue with .lt, it returns negative value
    expect(BinarySearchBounds.lowerBound(array, 100)).toBe(0);
    expect(BinarySearchBounds.lowerBound(array, 300)).toBe(4);
    expect(BinarySearchBounds.lowerBound(array, 10000)).toBe(9);
    expect(BinarySearchBounds.lowerBound(array, 11000)).toBe(9);
  });

  test('transform to UTM Zone 50 EPSG28350', () => {
    test_utm_to_mgrs(
      {
        utm_zone: 50,
        lat_band: 'J',
        column: 'L',
        row: 'K',
      },
      [300000.0, 6400000.0]
    );

    test_utm_to_mgrs(
      {
          utm_zone: 48,
          lat_band: 'P',
          column: 'U',
          row: 'V'
      }, 
      [300000.0, 1400000.0]
    );

    test_utm_to_mgrs(
    {
        utm_zone: 21,
        lat_band: 'H',
        column: 'T',
        row: 'E'
    },
    [200000.0, 6400000.0]);
  });
});
