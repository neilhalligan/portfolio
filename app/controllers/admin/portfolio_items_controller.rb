class Admin::PortfolioItemsController < ApplicationController
  def index
    @portfolio_items = PortfolioItem.all
  end

  def edit
    @portfolio_item = PortfolioItem.find(params[:id])
  end

  def update
    @portfolio_item = PortfolioItem.find(params[:id])
    if @portfolio_item.update(portfolio_params)
      redirect_to admin_portfolio_items_url
    else
      render :edit
    end
  end

  def new
    @portfolio_item = PortfolioItem.new
  end

  def create
    @portfolio_item = PortfolioItem.new(portfolio_params)
    if @portfolio_item.save
      redirect_to admin_portfolio_items_url
    else
      render :new
    end
  end


  private

  def portfolio_params
    params.require(:portfolio_item).permit(:title, :description, :category, :item_url, :background_image)
  end
end