using DemoAngularPagination.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DemoAngularPagination.ApiControllers
{
    public class ProductsController : ApiController
    {
        private static IEnumerable<Product> _products;
        
        static ProductsController() {
            _products = Enumerable.Range(1, 100)
                                .Select(i => new Product()
                                {
                                    Id = i,
                                    Name = "Product " + i.ToString()
                                }).ToArray();
        }

        public PagedCollection<Product> Get(int? page, int? pageSize)
        {
            var currPage = page.GetValueOrDefault(0);
            var currPageSize = pageSize.GetValueOrDefault(10);

            var paged = _products.Skip(currPage * currPageSize)
                                .Take(currPageSize)
                                .ToArray();

            var totalCount = _products.Count();

            return new PagedCollection<Product>()
            {
                Page = currPage,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((decimal)totalCount / currPageSize),
                Items = paged
            };
        }

        public Product Get(int id) {
            return _products.FirstOrDefault(p => p.Id == id);
        }
    }
}